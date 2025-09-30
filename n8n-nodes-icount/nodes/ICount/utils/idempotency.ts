export function generateIdempotencyKey(
    context: any,
    operation: string,
): string {
    const workflowId = context.getWorkflow().id;
    const executionId = context.getExecutionId();
    const nodeId = context.getNode().id;
    const itemIndex = context.getItemIndex ? context.getItemIndex() : 0;

    return `${workflowId}-${executionId}-${nodeId}-${operation}-${itemIndex}`;
}

export function addIdempotencyToBody(
    context: any,
    body: any,
    operation: string,
): any {
    const idempotencyKey = generateIdempotencyKey(context, operation);

    return {
        ...body,
        idempotency_key: idempotencyKey,
    };
}