import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode } from './fiber';
import { UpdateQueue, processUpdateQueue } from './updateQueue';
import { HostComponent, HostRoot, HostText } from './workTags';
import { mountChildFibers, reconcileChildFibers } from './childFibers';

// 递归中的递阶段
export function beginWork(workInProgress: FiberNode) {
	// 比较, 返回子fiberNode
	switch (workInProgress.tag) {
		case HostRoot:
			return updateHostRoot(workInProgress);
		case HostComponent:
			return updateHostComponent(workInProgress);
		// HostText没有beginWork工作流程(因为没有子节点), 文本节点
		case HostText:
			return null;
		default:
			if (__DEV__) {
				console.warn('beginWork未实现类型');
			}
			break;
	}
	return null;
}
// 1.计算状态的最新值
// 2.创建子fiberNode
export function updateHostRoot(workInProgress: FiberNode) {
	const baseState = workInProgress.memoizedState;
	const updateQueue = workInProgress.updateQueue as UpdateQueue<Element>;
	const pending = updateQueue.shared.pedding;
	updateQueue.shared.pedding = null;
	// memoizedState为当前hostRoot的最新状态
	const { memoizedState } = processUpdateQueue(baseState, pending);
	workInProgress.memoizedState = memoizedState;
	const nextChildren = workInProgress.memoizedState;
	reconcileChildren(workInProgress, nextChildren);
	return workInProgress.child;
}

function updateHostComponent(workInProgress: FiberNode) {
	const nextProps = workInProgress.pendingProps;
	const nextChildren = nextProps.children;
	reconcileChildren(workInProgress, nextChildren);
	return workInProgress.child;
}

function reconcileChildren(
	workInProgress: FiberNode,
	children?: ReactElementType
) {
	const current = workInProgress.alternate;
	if (current !== null) {
		// update
		workInProgress.child = reconcileChildFibers(
			workInProgress,
			current?.child,
			children as ReactElementType
		);
	} else {
		// mount
		workInProgress.child = mountChildFibers(
			workInProgress,
			null,
			children as ReactElementType
		);
	}
}
