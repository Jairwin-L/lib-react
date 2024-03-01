import { beginWork } from './beginWork';
import { commitMutationEffects } from './commitWork';
import { completeWork } from './completeWork';
import { FiberNode, FiberRootNode, createWorkInProgress } from './fiber';
import { MutationMask, NoFlags } from './fiberFlags';
import { HostRoot } from './workTags';

let workInProgress: FiberNode | null = null;
// 用于执行初始化操作
function prepareFreshStack(root: FiberRootNode) {
	workInProgress = createWorkInProgress(root.current, {});
}

export function scheduleUpdateOnFiber(fiber: FiberNode) {
	// TODO:调度功能
	// fiberRootNode
	const root = markUpdateFromFiberToRoot(fiber);
	renderRoot(root);
}

function markUpdateFromFiberToRoot(fiber: FiberNode) {
	let node = fiber;
	let parent = node.return;
	while (parent !== null) {
		node = parent;
		parent = node.return;
	}
	if (node.tag === HostRoot) {
		return node.stateNode;
	}
	return null;
}

function renderRoot(root: FiberRootNode) {
	// 初始化
	prepareFreshStack(root);
	do {
		try {
			workLoop();
			break;
		} catch (error) {
			if (__DEV__) {
				console.error(`renderRoot:workLoop error------>`, error);
			}
			workInProgress = null;
		}
	} while (true);
	root.finishedWork = root.current.alternate;
	// wip fiberNpde树 树中的flags 执行具体的dom操作
	commitRoot(root);
}

function commitRoot(root: FiberRootNode) {
	const { finishedWork } = root;
	if (finishedWork === null) {
		return;
	}
	if (__DEV__) {
		console.warn(`commit阶段开始------>`, finishedWork);
	}
	// 重置
	root.finishedWork = null;
	// 判断是否存在3个子阶段需要执行的操作
	// root flags / subTreeFlags
	const subTreeHasEffect =
		(finishedWork.subTreeFlags & MutationMask) !== NoFlags;
	const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags;
	if (subTreeHasEffect || rootHasEffect) {
		// beforeMutation
		// mutation Placement
		// finishedWork: 本次更新生成的workInProgress fiber树
		// current fiber树
		root.current = finishedWork;
		commitMutationEffects(finishedWork);
		// layout
	} else {
		root.current = finishedWork;
	}
}

function workLoop() {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress);
	}
}

function performUnitOfWork(fiber: FiberNode) {
	const next = beginWork(fiber);
	fiber.memoizedProps = fiber.pendingProps;
	if (next === null) {
		completeUnitOfWork(fiber);
	} else {
		workInProgress = next;
	}
}

function completeUnitOfWork(fiber: FiberNode) {
	let node: FiberNode | null = fiber;
	do {
		completeWork(node);
		const { sibling } = node;
		if (sibling !== null) {
			workInProgress = sibling;
			return;
		}
		node = node.return;
		workInProgress = node;
	} while (node !== null);
}
