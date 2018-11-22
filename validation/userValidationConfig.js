// contains description and validation requirements for every piece of data
//
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
                values: false,
                errorMessage: "Password cannot be empty."
            },
            {
               type: "confirmation",
                values: {
                   first: (first) => {return first;},
                   second: (second) => {return second;}
                },
                errorMessage: "Password is not equal to confirmation."
            }
        ]
    }
];