const keywordMap = {
    // gaming
    gaming: "gamepad2",
    game: "gamepad2",

    // coffee
    coffee: "coffee",

    // pets
    pet: "pawprint",
    dog: "pawprint",
    cat: "pawprint",
    bunny: "pawprint",

    // clothing
    clothing: "shirt",
    clothes: "shirt",

    // health
    health: "heartPulse",

    // transport
    transport: "car",
    gas: "car",
    
    // food
    groceries: "apple",
    grocery: "apple",
    food: "apple",

    // bills
    bills: "coins",
    rent: "coins",
    subscription: "coins",

    // shopping
    shopping: "handbag",

    // entertainment
    entertainment: "clapperboard",
    movie: "clapperboard",

    // eating out
    bar: "wine",
    restaurant: "wine",
    dinner: "wine",
    hangout: "wine",
    dine: "wine",

    // electronics
    electronic: "headset",

    // music
    music: "music",

    // gym
    gym: "dumbbell",

    // books
    book: "libraryBig",

    // selfcare
    selfcare: "bubbles",
    spa: "bubbles",

    // sports
    sports: "volleyball",

    // travel
    flight: "plane",
    trip: "plane",
    travel: "plane",

    // furniture
    furniture: "sofa",

    // income
    salary: "banknote",
    gift: "banknote",
    freelance: "banknote",
    refund: "banknote",
    business: "banknote"
}

export function getCategoryIcon(name) {
    const lower = name.toLowerCase()

    for (const keyword in keywordMap) {
        if (lower.includes(keyword)) {
            return keywordMap[keyword]
        }
    }

    return "circle" // fallback icon
}