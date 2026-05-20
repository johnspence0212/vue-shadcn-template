using Api.Data;
using Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public abstract class BaseController<T>(AppDbContext context) : ControllerBase where T : BaseEntity
{
    protected readonly DbSet<T> _dbSet = context.Set<T>();

    [HttpGet]
    public virtual async Task<ActionResult<IEnumerable<T>>> GetAll()
    {
        return await _dbSet.ToListAsync();
    }

    [HttpGet("{id}")]
    public virtual async Task<ActionResult<T>> Get(int id)
    {
        var entity = await _dbSet.FindAsync(id);
        if (entity is null)
        {
            return NotFound();
        }
        return entity;
    }

    [HttpPost]
    public virtual async Task<ActionResult<T>> Post(T entity)
    {
        _dbSet.Add(entity);
        await context.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = entity.Id }, entity);
    }

    [HttpPut("{id}")]
    public virtual async Task<IActionResult> Put(int id, T entity)
    {
        if (id != entity.Id)
        {
            return BadRequest();
        }

        context.Entry(entity).State = EntityState.Modified;

        try
        {
            await context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await EntityExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public virtual async Task<IActionResult> Delete(int id)
    {
        var entity = await _dbSet.FindAsync(id);
        if (entity is null)
        {
            return NotFound();
        }

        _dbSet.Remove(entity);
        await context.SaveChangesAsync();
        return NoContent();
    }

    protected virtual async Task<bool> EntityExists(int id)
    {
        return await _dbSet.AnyAsync(e => e.Id == id);
    }
}
