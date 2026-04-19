import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Spinner } from "../components/Spinner";
import { useToast } from "../components/Toast";
import * as api from "../services/api";

interface Rotation {
  id: string;
  name: string;
  schedule: string;
  assignedCount: number;
}

export function SettingsRotations() {
  const { showToast } = useToast();
  const [rotations, setRotations] = useState<Rotation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRotations();
  }, []);

  async function loadRotations() {
    try {
      const data = await api.getRotations();
      setRotations(data);
    } catch {
      showToast("Failed to load rotations", "error");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(rotationId: string) {
    try {
      await api.deleteRotation(rotationId);
      setRotations((prev) => prev.filter((r) => r.id !== rotationId));
      showToast("Rotation deleted", "success");
    } catch {
      showToast("Failed to delete rotation", "error");
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center space-x-4">
        <Link to="/settings" className="text-gray-400 hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold">Duty Rotations</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : (
        <div className="space-y-3">
          {rotations.length === 0 ? (
            <Card>
              <p className="text-center text-gray-400 py-4">No rotations configured yet</p>
            </Card>
          ) : (
            rotations.map((rotation) => (
              <Card key={rotation.id}>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{rotation.name}</h3>
                    <div className="flex items-center space-x-3 text-sm text-gray-400">
                      <span>{rotation.schedule}</span>
                      <span>•</span>
                      <span>{rotation.assignedCount} members</span>
                    </div>
                  </div>
                  <Button variant="danger" onClick={() => handleDelete(rotation.id)}>
                    Delete
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
