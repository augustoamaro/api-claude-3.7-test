/**
 * Utilitário para validação de dados
 */

/**
 * Verifica se um valor é uma string não vazia
 * @param {*} value - Valor a ser verificado
 * @returns {boolean} Resultado da validação
 */
const isValidString = (value) => {
    return typeof value === 'string' && value.trim().length > 0;
};

/**
 * Verifica se um valor é um número
 * @param {*} value - Valor a ser verificado
 * @returns {boolean} Resultado da validação
 */
const isValidNumber = (value) => {
    if (typeof value === 'number') return !isNaN(value);
    if (typeof value === 'string') return !isNaN(Number(value));
    return false;
};

/**
 * Verifica se um valor é um booleano
 * @param {*} value - Valor a ser verificado
 * @returns {boolean} Resultado da validação
 */
const isValidBoolean = (value) => {
    return typeof value === 'boolean';
};

/**
 * Verifica se um valor é um ID válido
 * @param {*} id - ID a ser verificado
 * @returns {boolean} Resultado da validação
 */
const isValidId = (id) => {
    if (!id) return false;
    return isValidNumber(id) && Number(id) > 0;
};

/**
 * Valida um objeto de acordo com um esquema
 * @param {Object} data - Dados a serem validados
 * @param {Object} schema - Esquema de validação
 * @returns {Object} Resultado da validação
 */
const validateSchema = (data, schema) => {
    const errors = [];

    Object.keys(schema).forEach(field => {
        const rules = schema[field];

        // Verificar se o campo é obrigatório
        if (rules.required && (data[field] === undefined || data[field] === null)) {
            errors.push(`O campo '${field}' é obrigatório`);
            return;
        }

        // Se o campo não existe e não é obrigatório, pular validação
        if (data[field] === undefined || data[field] === null) {
            return;
        }

        // Validar tipo
        if (rules.type) {
            let isValid = false;

            switch (rules.type) {
                case 'string':
                    isValid = typeof data[field] === 'string';
                    break;
                case 'number':
                    isValid = isValidNumber(data[field]);
                    break;
                case 'boolean':
                    isValid = isValidBoolean(data[field]);
                    break;
                default:
                    isValid = true;
            }

            if (!isValid) {
                errors.push(`O campo '${field}' deve ser do tipo ${rules.type}`);
            }
        }

        // Validar tamanho mínimo (para strings)
        if (rules.minLength && typeof data[field] === 'string' && data[field].length < rules.minLength) {
            errors.push(`O campo '${field}' deve ter pelo menos ${rules.minLength} caracteres`);
        }

        // Validar tamanho máximo (para strings)
        if (rules.maxLength && typeof data[field] === 'string' && data[field].length > rules.maxLength) {
            errors.push(`O campo '${field}' deve ter no máximo ${rules.maxLength} caracteres`);
        }

        // Validar valor mínimo (para números)
        if (rules.min !== undefined && isValidNumber(data[field]) && Number(data[field]) < rules.min) {
            errors.push(`O campo '${field}' deve ser maior ou igual a ${rules.min}`);
        }

        // Validar valor máximo (para números)
        if (rules.max !== undefined && isValidNumber(data[field]) && Number(data[field]) > rules.max) {
            errors.push(`O campo '${field}' deve ser menor ou igual a ${rules.max}`);
        }
    });

    return {
        isValid: errors.length === 0,
        errors
    };
};

module.exports = {
    isValidString,
    isValidNumber,
    isValidBoolean,
    isValidId,
    validateSchema
}; 