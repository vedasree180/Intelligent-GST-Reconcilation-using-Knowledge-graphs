import networkx as nx

class ReconciliationEngine:
    def __init__(self):
        self.in_memory_graph = nx.DiGraph()

    def add_invoice(self, invoice_id: str, supplier_gstin: str, buyer_gstin: str, amount: float, tax_amount: float, return_type: str):
        return_type = str(return_type) if return_type else "UNKNOWN"
        self.in_memory_graph.add_edge(
            supplier_gstin,
            buyer_gstin,
            invoice_id=invoice_id,
            amount=amount,
            tax=tax_amount,
            type=return_type
        )

    def get_ego_graph(self, center_node: str, radius: int = 2):
        if center_node not in self.in_memory_graph:
            return {"nodes": [], "links": []}
            
        ego = nx.ego_graph(self.in_memory_graph, center_node, radius=radius)
        data = nx.node_link_data(ego)
        
        # Transform for d3 logic
        nodes = [{"id": n["id"], "group": 1} for n in data["nodes"]]
        links = [{"source": l["source"], "target": l["target"], "value": l.get("amount", 1)} for l in data["links"]]
        return {"nodes": nodes, "links": links}

    def get_full_graph(self):
        data = nx.node_link_data(self.in_memory_graph)
        nodes = [{"id": n["id"], "group": 1} for n in data["nodes"]]
        links = [{"source": l["source"], "target": l["target"], "value": l.get("amount", 1)} for l in data["links"]]
        return {"nodes": nodes, "links": links}

    def analyze_node_risk(self, node_id: str):
        if node_id not in self.in_memory_graph:
            return {"score": 0.1, "category": "LOW", "exposure": 0}
        
        # Calculate exposure: sum of incoming tax + sum of outgoing tax
        exposure = 0.0
        in_edges = self.in_memory_graph.in_edges(node_id, data=True)
        out_edges = self.in_memory_graph.out_edges(node_id, data=True)
        
        for _, _, data in in_edges:
            exposure += float(data.get("tax", 0.0))
        for _, _, data in out_edges:
            exposure += float(data.get("tax", 0.0))
            
        in_degree = self.in_memory_graph.in_degree(node_id)
        out_degree = self.in_memory_graph.out_degree(node_id)
        
        # Simple heuristic risk score
        # For instance, high out_degree vs low in_degree, or cycle participation
        score = 0.2
        if exposure > 100000:
            score += 0.3
        if in_degree > 3 and out_degree > 3:
            score += 0.4 # Potential Circular Trading or Hub
        
        score = min(score, 1.0)
        
        category = "LOW"
        if score > 0.7:
            category = "CRITICAL"
        elif score > 0.4:
            category = "HIGH"
        elif score > 0.2:
            category = "MEDIUM"
            
        return {"score": score, "category": category, "exposure": exposure}

    def get_all_vendors_metrics(self):
        vendors = []
        for node in self.in_memory_graph.nodes():
            risk_info = self.analyze_node_risk(node)
            node_str = str(node)
            short_name = node_str[0:6] if len(node_str) > 6 else node_str
            vendors.append({
                "id": node_str,
                "name": f"Entity {short_name}",
                "exposure": risk_info["exposure"],
                "score": risk_info["score"],
                "risk": risk_info["category"]
            })
        return sorted(vendors, key=lambda x: x["score"], reverse=True)

engine = ReconciliationEngine()
