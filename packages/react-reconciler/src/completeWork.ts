import {
	Container,
	Instance,
	appendInitialChild,
	createInstance,
	createTextInstance
} from 'react-dom/src/hostConfig';
import { FiberNode } from './fiber';
import { HostComponent, HostRoot, HostText } from './workTags';
import { NoFlags } from './fiberFlags';

// 递归中的归阶段
export function completeWork(workInProgress: FiberNode) {
	const newProps = workInProgress.pendingProps;
	const current = workInProgress.alternate;
	switch (workInProgress.tag) {
		case HostComponent:
			if (current !== null && workInProgress.stateNode) {
				// TODO:暂不处理
				// update
			} else {
				// 1. 构建DOM
				// TODO:const instance = createInstance(workInProgress.type, newProps);
				const instance = createInstance(workInProgress.type, newProps);
				// 2. 将DOM插入到DOM树中
				appendAllChildren(instance, workInProgress);
				workInProgress.stateNode = instance;
			}
			bubbleProperties(workInProgress);
			return null;
		case HostText:
			if (current !== null && workInProgress.stateNode) {
				// update
			} else {
				// 1. 构建DOM
				const instance = createTextInstance(newProps.content);
				workInProgress.stateNode = instance;
			}
			bubbleProperties(workInProgress);
			return null;
		case HostRoot:
			bubbleProperties(workInProgress);
			return null;
		default:
			if (__DEV__) {
				console.warn('未处理的completeWork情况', workInProgress);
			}
			break;
	}
}

function appendAllChildren(
	parent: Instance | Container,
	workInProgress: FiberNode
) {
	let node = workInProgress.child;
	while (node !== null) {
		if (node.tag === HostComponent || node.tag === HostText) {
			appendInitialChild(parent, node.stateNode);
		} else if (node.child !== null) {
			node.child.return = node;
			node = node.child;
			continue;
		}
		if (node === workInProgress) {
			return;
		}
		while (node.sibling === null) {
			if (node.return === null || node.return === workInProgress) {
				return;
			}
			node = node.return;
		}
		node.sibling.return = node.return;
		node = node.sibling;
	}
}

function bubbleProperties(workInProgress: FiberNode) {
	let subTreeFlags = NoFlags;
	let { child } = workInProgress;
	while (child !== null) {
		subTreeFlags |= child.subTreeFlags;
		subTreeFlags |= child.flags;
		child.return = workInProgress;
		child = child.sibling;
	}
	workInProgress.subTreeFlags |= subTreeFlags;
}
