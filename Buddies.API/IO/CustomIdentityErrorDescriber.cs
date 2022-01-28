using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace Buddies.API.IO;

public class CustomIdentityErrorDescriber : IdentityErrorDescriber
{
    private readonly IdentityOptions _options;
    
    public CustomIdentityErrorDescriber(IOptions<IdentityOptions> options)
    {
        _options = options.Value;
    }
    
    public override IdentityError InvalidEmail(string email)
    {
        return new IdentityError
        {
            Code = base.InvalidEmail(email).Code,
            Description = "Email is invalid."
        };
    }

    public override IdentityError DuplicateEmail(string email)
    {
        return new IdentityError
        {
            Code = base.DuplicateEmail(email).Code,
            Description = "Email is taken."
        };
    }

    public override IdentityError PasswordTooShort(int length)
    {
        return new IdentityError
        {
            Code = base.PasswordTooShort(length).Code,
            Description = $"Password must be at least {_options.Password.RequiredLength} characters long."
        };
    }

    public override IdentityError PasswordRequiresNonAlphanumeric()
    {
        return new IdentityError
        {
            Code = base.PasswordRequiresNonAlphanumeric().Code,
            Description = "Password must contain a symbol."
        };
    }

    public override IdentityError PasswordRequiresDigit()
    {
        return new IdentityError
        {
            Code = base.PasswordRequiresDigit().Code,
            Description = "Password must contain a number."
        };
    }

    public override IdentityError PasswordRequiresLower()
    {
        return new IdentityError
        {
            Code = base.PasswordRequiresLower().Code,
            Description = "Password must contain a lowercase letter."
        };
    }

    public override IdentityError PasswordRequiresUpper()
    {
        return new IdentityError
        {
            Code = base.PasswordRequiresUpper().Code,
            Description = "Password must contain an uppercase letter."
        };
    }
}