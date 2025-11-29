
export function extractErrorMessage(error: any, defaultMessage: string = 'Ocorreu um erro inesperado'): string {
    if (!error) return defaultMessage;

    // Se for string direta
    if (typeof error === 'string') return error;

    // Se tiver response.data (Axios)
    if (error.response?.data) {
        const data = error.response.data;

        // Caso 1: message é string direta no data
        if (typeof data.message === 'string') {
            return data.message;
        }

        // Caso 2: message é array de strings
        if (Array.isArray(data.message)) {
            return data.message.join(', ');
        }

        // Caso 3: message é objeto
        if (typeof data.message === 'object' && data.message !== null) {
            const nestedMessage = data.message;

            // Subcaso 3a: Validação do Zod/NestJS (array de errors)
            // Ex: { message: { errors: [{ message: "Senha muito curta" }] } }
            if (Array.isArray((nestedMessage as any).errors)) {
                const errors = (nestedMessage as any).errors;
                return errors
                    .map((e: any) => e.message || JSON.stringify(e))
                    .join(', ');
            }

            // Subcaso 3b: Mensagem aninhada simples
            // Ex: { message: { message: "Erro específico" } }
            if ('message' in nestedMessage && typeof (nestedMessage as any).message === 'string') {
                return (nestedMessage as any).message;
            }
        }
    }

    // Fallback para mensagem de erro do objeto Error
    if (error.message && typeof error.message === 'string') {
        return error.message;
    }

    return defaultMessage;
}
