namespace Api.Options;

public class JwtOptions
{
    public const string SectionName = "Jwt";

    public string Secret { get; set; } = string.Empty;
    public string Issuer { get; set; } = "TemplateApi";
    public string Audience { get; set; } = "TemplateWeb";
    public int ExpirationMinutes { get; set; } = 60;
}
