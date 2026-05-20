using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Models;

namespace Api.Controllers;

[ApiController]
public abstract class BaseController<T> : ControllerBase where T : BaseEntity
{
    protected readonly AppDbContext _context;
    protected readonly DbSet<T> _dbSet;

    protected BaseController(AppDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    // GET: api/[controller]
    [HttpGet]
    public virtual async Task<ActionResult<IEnumerable<T>>> GetAll()
    {
        return await _dbSet.ToListAsync();
    }

    // GET: api/[controller]/5
    [HttpGet("{id}")]
    public virtual async Task<ActionResult<T>> Get(int id)
    {
        var entity = await _dbSet.FindAsync(id);

        if (entity == null)
        {
            return NotFound();
        }

        return entity;
    }

    // POST: api/[controller]
    [HttpPost]
    public virtual async Task<ActionResult<T>> Post(T entity)
    {
        _dbSet.Add(entity);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(Get), new { id = entity.Id }, entity);
    }

    // PUT: api/[controller]/5
    [HttpPut("{id}")]
    public virtual async Task<IActionResult> Put(int id, T entity)
    {
        if (id != entity.Id)
        {
            return BadRequest();
        }

        _context.Entry(entity).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!EntityExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    // DELETE: api/[controller]/5
    [HttpDelete("{id}")]
    public virtual async Task<IActionResult> Delete(int id)
    {
        var entity = await _dbSet.FindAsync(id);
        if (entity == null)
        {
            return NotFound();
        }

        _dbSet.Remove(entity);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    protected virtual bool EntityExists(int id)
    {
        return _dbSet.Any(e => e.Id == id);
    }
}