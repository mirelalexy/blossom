export function filterRules(rules, filters) {
    return rules.filter((rule) => {
        if(!matchesCategory(rule, filters)) return false
        if(!matchesType(rule, filters)) return false
        return true
    })
}

function matchesCategory(rule, filters) {
    if(!filters.category) return true
    return rule.category_id === filters.category
}

function matchesType(rule, filters) {
    if(!filters.type) return true
    return rule.type === filters.type
}