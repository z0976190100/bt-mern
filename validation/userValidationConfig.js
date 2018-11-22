// contains description and validation requirements for every piece of data
// TODO: error object instead of errorMessage. Consider this:
/*
*{
    "errors": {
        "name": {
            "message": "Path `name` is required.",
            "name": "ValidatorError",
            "properties": {
                "message": "Path `name` is required.",
                "type": "required",
                "path": "name"
            },
            "kind": "required",
            "path": "name"
        }
    },
    "_message": "users validation failed",
    "message": "users validation failed: name: Path `name` is required.",
    "name": "ValidationError"
},
{
    "errors": {
        "email": {
            "message": "Path `email` is required.",
            "name": "ValidatorError",
            "properties": {
                "message": "Path `email` is required.",
                "type": "required",
                "path": "email"
            },
            "kind": "required",
            "path": "email"
        }
    },
    "_message": "users validation failed",
    "message": "users validation failed: email: Path `email` is required.",
    "name": "ValidationError"
}
*
 */
module.exports = [
    {
        param: "password",
        constraints: [
            {
                type: "length",
                values: {
                    min: 8,
                    max: 120
                },
                errorMessage: "Password must be at least 8 characters long, but not longer then 120."
            },
            {
                type: "empty",
                values: {},
                errorMessage: "Password cannot be empty."
            },
            {
                type: "confirmation",
                values: {
                    first: (first) => {
                        return first;
                    },
                    second: (second) => {
                        return second;
                    }
                },
                errorMessage: "Password is not equal to confirmation."
            }
        ]
    },
    {
        param: "email",
        constraints: [
            {
                type: "email",
                values: {},
                errorMessage: "Hmm. This does not look like an email."
            },
            {
                type: "empty",
                values: {},
                errorMessage: "Field cannot be empty."
            }
        ]
    },
    {
        param: "name",
        constraints: [
            {
                type: "length",
                values: {
                    min: 2,
                    max: 42
                },
                errorMessage: "Name must be at least 2 characters long, but not longer then 42."
            },
            {
                type: "empty",
                values: {},
                errorMessage: "Field cannot be empty."
            }
        ]
    }
];