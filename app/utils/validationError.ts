export const processValidationErrors = (validationErrors: any) => {
    const errorMessages: any = {};
    validationErrors.forEach((error: any) => {
      const { field, constraints } = error;
      if (constraints) {
        errorMessages[field] = Object.values(constraints).join(', ');
      }
    });
    return errorMessages;
  };