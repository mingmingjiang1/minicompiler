// 基本节点类型
export class Node {
	public next: null | Node;
	public index: number;
	public edge: string | undefined | null | string[]; // 边值null是epsilon，undefined没有定义，标识一个原始vertex
  constructor(index: number, nextNode: Node | null, edge?: string | null | string[]) {
    this.index = index;
    this.next = nextNode;
    if (Array.isArray(edge)) {
      Array.isArray(this.edge) ? this.edge.push(...edge) : this.edge = [...edge];
    } else {
      Array.isArray(this.edge) ? this.edge.push(edge) : this.edge = [edge];
    }
  }
  add_adj_vertex(nextNodeIndex: number | null, edge: any) {
    const nextNode = new Node(nextNodeIndex, this.next, edge);
    return nextNode;
  }
}

export class VertexNode {
  public index: number;
  public edgeVal: string[] | string;
  public firstEdge: Node;
  constructor(index: number, edge: string[] | string) {
    this.index = index;
    this.firstEdge = null;
    this.edgeVal = edge;
    Graph.node_id++;
  }
}

export let node_id = 1;

export class Graph {
	static node_id = 1;
	public adj: VertexNode[] = [];
	constructor(nums: number) {
		Graph.node_id = nums;
		// for (let i = 0;i < nums; i++) {
		// 	this.adj = [
		// 		...this.adj,
		// 		new Node(i, null, undefined),
    //   ]
		// }
	}
  addVertexNode(vertex: VertexNode, index: number) {
    vertex.firstEdge = null;
    this.adj[index] = vertex;
  }
	getVertex(index: number) {
		return this.adj[index];
	}
  // 新增节点
  add_single_vertex(index: number, node: Node | null) {
		this.adj = {
			...this.adj,
			[index]: null,
		}; 
  }
		
	// }
	// copy() {

	// }
}

const graph = new Graph(0);

export default graph;

export function or(a: VertexNode, b: VertexNode): VertexNode {
  const nodeStart = new VertexNode(Graph.node_id, null)
  graph.addVertexNode(nodeStart, nodeStart.index);
  nodeStart.firstEdge = new Node(a.index, null, a.edgeVal || null);
  nodeStart.firstEdge.next = new Node(b.index, null, b.edgeVal || null);
  const nodeEnd = new VertexNode(Graph.node_id, null)
  graph.addVertexNode(nodeEnd, nodeEnd.index);
  connect(a, nodeEnd);
  connect(b, nodeEnd);
  return nodeStart;
}

export function connect(from: VertexNode, to: VertexNode): VertexNode {
	// from的尾和to的头相互连接,注意circle
	let cur = graph.getVertex(from.index); // 获取邻接表
  const memo: number[] = [];
	while (cur.firstEdge && !memo.includes(cur.index)) {
    memo.push(cur.index);
    cur = graph.getVertex(cur.firstEdge.index);
	}
  // next
  
  graph.getVertex(cur.index).firstEdge = new Node(to.index, graph.getVertex(cur.index).firstEdge);
  // if (!cur) {
  //   // if adj is empty
  //   graph.getVertex(from.index).firstEdge = new Node(to.index, null);
  // } else {
  //   graph.getVertex(cur.index).firstEdge = new Node(to.index, null);
  // }
	return from;
}

export function getEndofPath(from: VertexNode) {
	let cur = graph.getVertex(from.index); // 获取邻接表
  const memo: number[] = [];
	while (cur.firstEdge && !memo.includes(cur.index)) {
    memo.push(cur.index);
    cur = graph.getVertex(cur.firstEdge.index);
	}
  return cur;
}

export function characters(chars: string[]) {
  // const nodeStart = new Node(Graph.node_id, null, null);
  const nodeStart = new VertexNode(Graph.node_id, null)
  graph.addVertexNode(nodeStart, nodeStart.index);
  const nodeEnd = new Node(Graph.node_id, null, chars);
  // graph.add_single_vertex(Graph.node_id, nodeEnd);
  const tmp = new VertexNode(nodeEnd.index, chars);
  graph.addVertexNode(tmp, tmp.index);

  const pre = nodeStart.firstEdge;
  nodeStart.firstEdge = nodeEnd;
  nodeEnd.next = pre;

  return nodeStart;
}

export function plus(base: VertexNode) {
  // 基于old新建节点
  let nodeStart = new VertexNode(Graph.node_id, base.edgeVal);
  nodeStart.firstEdge = base.firstEdge;
  const res = nodeStart;
  // console.log(2222, nodeStart.index)
  graph.addVertexNode(nodeStart, nodeStart.index);
  let cur = base?.firstEdge;
  while (cur) {
    const vertexNode = graph.getVertex(cur?.index);
    const tmp = new VertexNode(Graph.node_id, vertexNode.edgeVal);
    nodeStart.firstEdge = new Node(tmp.index, null, vertexNode.edgeVal);
    nodeStart = tmp;
    tmp.firstEdge = base.firstEdge;
    graph.addVertexNode(tmp, tmp.index);
    cur = vertexNode.firstEdge;
  }
  // graph.addVertexNode(nodeStart, nodeStart.index);
  return mutipliy(res);
}

export function mutipliy(wrapped: VertexNode): VertexNode {
  // const nodeStart = new Node(Graph.node_id, wrapped, null);
  const nodeStart = new VertexNode(Graph.node_id, null)
  graph.addVertexNode(nodeStart, nodeStart.index);
  const tmp = new Node(wrapped.index, null, null);
  nodeStart.firstEdge = tmp;
	let cur = graph.getVertex(wrapped.index); // 获取邻接表
	while (cur.firstEdge) {
    cur = graph.getVertex(cur.firstEdge.index);
	}
  connect(cur, nodeStart)
  return nodeStart;
}

function test() {
  let y;
  return y = 1 + 2;
}
