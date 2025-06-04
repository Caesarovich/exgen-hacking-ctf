import { defaultFileSystem } from "../default-data/files";
import type { System } from "./system";

export interface FileNode {
	type: "file";
	content: string;
	permissions: { read: string[] };
}

export interface DirectoryNode {
	type: "directory";
	children: { [key: string]: FileSystemNode };
	permissions: { read: string[] };
}

export type FileSystemNode = FileNode | DirectoryNode;

export interface FileSystemStructure {
	[key: string]: FileSystemNode;
}

export class FileSystem {
	private system: System;

	private fileTree: FileSystemStructure;
	private _currentDirectory: string;

	constructor(system: System) {
		this.system = system;
		this.fileTree = structuredClone(defaultFileSystem);
		this._currentDirectory = "/home";
	}

	get currentDirectory(): string {
		return this._currentDirectory;
	}

	set currentDirectory(path: string) {
		const node = this.getNode(path);

		if (node.type !== "directory")
			throw new Error(`${path} is not a directory`);

		if (!this.checkPermissions(node, this.system.currentUser?.username))
			throw new Error(`Access denied: ${path}`);

		this._currentDirectory = path;
	}

	readDir(path: string): string[] {
		const node = this.getNode(path);

		if (node.type !== "directory")
			throw new Error(`${path} is not a directory`);

		if (!this.checkPermissions(node, this.system.currentUser?.username))
			throw new Error(`Access denied: ${path}`);

		return Object.keys(node.children);
	}

	readFile(path: string): string {
		const node = this.getNode(path);

		if (node.type !== "file") throw new Error(`${path} is not a file`);

		if (!this.checkPermissions(node, this.system.currentUser?.username))
			throw new Error(`Access denied: ${path}`);

		return node.content;
	}

	private getNode(path: string): FileSystemNode {
		const parts = path.split("/").filter(Boolean);
		let currentNode: FileSystemNode = this.fileTree["/"];

		for (const part of parts) {
			if (currentNode.type === "directory" && currentNode.children[part]) {
				currentNode = currentNode.children[part];
			} else {
				throw new Error(`Path not found: ${path}`);
			}
		}

		return currentNode;
	}

	private checkPermissions(node: FileSystemNode, user?: string): boolean {
		if (!user && node.permissions.read.length === 0) return true;
		if (!user) return false;

		return node.permissions.read.includes(user);
	}
}

export default FileSystem;
