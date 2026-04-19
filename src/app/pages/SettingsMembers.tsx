import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Card } from "../components/Card";
import { Avatar } from "../components/Avatar";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { Spinner } from "../components/Spinner";
import { useToast } from "../components/Toast";
import * as api from "../services/api";

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
}

export function SettingsMembers() {
  const { showToast } = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  async function loadMembers() {
    try {
      const data = await api.getMembers();
      setMembers(data);
    } catch {
      showToast("Failed to load members", "error");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRemove(userId: string) {
    try {
      await api.removeMember(userId);
      setMembers((prev) => prev.filter((m) => m.id !== userId));
      showToast("Member removed", "success");
    } catch {
      showToast("Failed to remove member", "error");
    }
  }

  async function handleGenerateInvite() {
    setIsGenerating(true);
    try {
      const { code } = await api.generateInviteCode();
      setInviteCode(code);
    } catch {
      showToast("Failed to generate invite code", "error");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center space-x-4">
        <Link to="/settings" className="text-gray-400 hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold">Household Members</h1>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleGenerateInvite} isLoading={isGenerating}>
          + Invite Member
        </Button>
      </div>

      {inviteCode && (
        <Card>
          <p className="text-sm text-gray-400 mb-1">Share this invite code:</p>
          <p className="text-xl font-mono font-bold text-blue-400">{inviteCode}</p>
          <p className="text-xs text-gray-500 mt-1">Single-use code. Share it with the new member.</p>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : (
        <div className="space-y-3">
          {members.map((member) => (
            <Card key={member.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar src={member.avatar} name={member.name} size="md" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{member.name}</h3>
                      <Badge variant={member.role === "admin" ? "info" : "primary"}>
                        {member.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400">{member.email}</p>
                  </div>
                </div>
                {member.role !== "admin" && (
                  <Button variant="danger" onClick={() => handleRemove(member.id)}>
                    Remove
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
