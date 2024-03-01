import { Action } from 'shared/ReactTypes';

export interface Update<State> {
	action: Action<State>;
}

export interface UpdateQueue<State> {
	shared: {
		pedding: Update<State> | null;
	};
}
// 更新对应的数据结构
export function createUpdate<State>(action: Action<State>): Update<State> {
	return {
		action
	};
}
// 保存update的数据结构
export function createUpdateQueue<State>() {
	return {
		shared: {
			pedding: null
		}
	} as UpdateQueue<State>;
}
// 将update插入到updateQueue中
export function enqueueUpdate<State>(
	updateQueue: UpdateQueue<State>,
	update: Update<State>
) {
	updateQueue.shared.pedding = update;
}
// 消费update
export function processUpdateQueue<State>(
	baseState: State,
	pendingUpdate: Update<State> | null
): { memoizedState: State } {
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memoizedState: baseState
	};
	if (pendingUpdate !== null) {
		const { action } = pendingUpdate;
		if (action instanceof Function) {
			// baseState 1 update (x) => 4x -> memoizedState 4
			result.memoizedState = action(baseState);
		} else {
			// baseState 1 update 2 -> memoizedState 2
			result.memoizedState = action;
		}
	}
	return result;
}
