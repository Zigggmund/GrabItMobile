export type ActionType = 'navigate' | 'goBack';
export type AttemptLeaveCallbackType = (action: ActionType) => Promise<AttemptLeaveResultType>;
export type AttemptLeaveResultType = 'allow' | 'block' | 'handled';
