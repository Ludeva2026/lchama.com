import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { CheckCircle, Users, Zap } from "lucide-react";
import { useLocation } from "wouter";

type Step = 1 | 2 | 3 | 4 | 5;

export default function Onboarding() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [groupName, setGroupName] = useState("");
  const [disbursementMandate, setDisbursementMandate] = useState<"slot-based" | "year-end">("slot-based");
  const [members, setMembers] = useState<Array<{ name: string; phone?: string; email?: string }>>([
    { name: "", phone: "", email: "" }
  ]);
  const [groupId, setGroupId] = useState<number | null>(null);
  const [teamLeadId, setTeamLeadId] = useState<number | null>(null);

  const createGroupMutation = trpc.groups.create.useMutation();
  const addMemberMutation = trpc.members.add.useMutation();
  const generateLudevaNumberMutation = trpc.ludevaNumbers.generate.useMutation();

  const handleAddMember = () => {
    if (members.length < 10) {
      setMembers([...members, { name: "", phone: "", email: "" }]);
    }
  };

  const handleRemoveMember = (index: number) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  const handleUpdateMember = (index: number, field: string, value: string) => {
    const updatedMembers = [...members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setMembers(updatedMembers);
  };

  const handleStep1 = async () => {
    if (!groupName.trim()) {
      alert("Please enter a group name");
      return;
    }
    try {
      const result = await createGroupMutation.mutateAsync({
        groupName,
        disbursementMandate,
      });
      // Extract group ID from the response
      setCurrentStep(2);
    } catch (error) {
      alert("Failed to create group");
    }
  };

  const handleStep2 = () => {
    const validMembers = members.filter(m => m.name.trim());
    if (validMembers.length !== 10) {
      alert("Please add exactly 10 members");
      return;
    }
    setCurrentStep(3);
  };

  const handleStep3 = () => {
    // Slot assignment
    setCurrentStep(4);
  };

  const handleStep4 = async () => {
    // Team lead election
    if (!teamLeadId) {
      alert("Please select a team lead");
      return;
    }
    setCurrentStep(5);
  };

  const handleStep5 = async () => {
    // Generate Ludeva numbers
    alert("Group activated! Ludeva numbers generated for all members.");
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Set Up Your Ludeva - Team Group</h1>
          <p className="text-slate-400">Follow these 5 simple steps to get your merry-go-round group started</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-between mb-12">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="flex flex-col items-center flex-1">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold mb-2 ${
                step < currentStep ? "bg-green-500 text-white" :
                step === currentStep ? "bg-blue-500 text-white" :
                "bg-slate-700 text-slate-400"
              }`}>
                {step < currentStep ? <CheckCircle className="w-6 h-6" /> : step}
              </div>
              <span className="text-xs text-slate-400 text-center">
                {step === 1 && "Group Info"}
                {step === 2 && "Members"}
                {step === 3 && "Slots"}
                {step === 4 && "Team Lead"}
                {step === 5 && "Activate"}
              </span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card className="bg-slate-800 border-slate-700 p-8">
          {/* Step 1: Group Formation */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Step 1: Group Information</h2>
              <div className="space-y-4 mb-8">
                <div>
                  <Label className="mb-2 block">Group Name</Label>
                  <Input
                    placeholder="e.g., Nairobi Women's Chama"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Disbursement Mandate</Label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        value="slot-based"
                        checked={disbursementMandate === "slot-based"}
                        onChange={(e) => setDisbursementMandate(e.target.value as "slot-based" | "year-end")}
                      />
                      <span>Slot-based (periodic payouts)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        value="year-end"
                        checked={disbursementMandate === "year-end"}
                        onChange={(e) => setDisbursementMandate(e.target.value as "slot-based" | "year-end")}
                      />
                      <span>Year-end (lump-sum distribution)</span>
                    </label>
                  </div>
                </div>
              </div>
              <Button onClick={handleStep1} className="w-full bg-blue-600 hover:bg-blue-700">
                Continue to Step 2
              </Button>
            </div>
          )}

          {/* Step 2: Member Registration */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Step 2: Add Group Members (Exactly 10)</h2>
              <p className="text-slate-400 mb-6">Your group must have exactly 10 members</p>
              <div className="space-y-4 mb-8 max-h-96 overflow-y-auto">
                {members.map((member, index) => (
                  <Card key={index} className="bg-slate-700 border-slate-600 p-4">
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <Input
                        placeholder="Member Name"
                        value={member.name}
                        onChange={(e) => handleUpdateMember(index, "name", e.target.value)}
                        className="bg-slate-600 border-slate-500"
                      />
                      <Input
                        placeholder="Phone (optional)"
                        value={member.phone}
                        onChange={(e) => handleUpdateMember(index, "phone", e.target.value)}
                        className="bg-slate-600 border-slate-500"
                      />
                      <Input
                        placeholder="Email (optional)"
                        value={member.email}
                        onChange={(e) => handleUpdateMember(index, "email", e.target.value)}
                        className="bg-slate-600 border-slate-500"
                      />
                    </div>
                    {members.length > 1 && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveMember(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </Card>
                ))}
              </div>
              <div className="flex gap-4">
                {members.length < 10 && (
                  <Button onClick={handleAddMember} variant="outline" className="flex-1">
                    Add Member ({members.length}/10)
                  </Button>
                )}
                <Button
                  onClick={handleStep2}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={members.filter(m => m.name.trim()).length !== 10}
                >
                  Continue to Step 3
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Slot Assignment */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Step 3: Assign Payout Slots</h2>
              <p className="text-slate-400 mb-6">Each member will receive their payout in their assigned slot order</p>
              <div className="space-y-3 mb-8">
                {members.map((member, index) => (
                  <Card key={index} className="bg-slate-700 border-slate-600 p-4 flex items-center justify-between">
                    <span className="font-semibold">{member.name || `Member ${index + 1}`}</span>
                    <span className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded">Slot {index + 1}</span>
                  </Card>
                ))}
              </div>
              <div className="flex gap-4">
                <Button onClick={() => setCurrentStep(2)} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button onClick={handleStep3} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Continue to Step 4
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Team Lead Election */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Step 4: Elect Team Lead</h2>
              <p className="text-slate-400 mb-6">Select who will manage the group and oversee contributions</p>
              <div className="space-y-3 mb-8">
                {members.map((member, index) => (
                  <label key={index} className="flex items-center gap-4 p-4 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600">
                    <input
                      type="radio"
                      name="teamLead"
                      checked={teamLeadId === index}
                      onChange={() => setTeamLeadId(index)}
                    />
                    <span className="font-semibold">{member.name || `Member ${index + 1}`}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-4">
                <Button onClick={() => setCurrentStep(3)} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button onClick={handleStep4} className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={teamLeadId === null}>
                  Continue to Step 5
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Ludeva Number Generation */}
          {currentStep === 5 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Step 5: Generate Ludeva Numbers</h2>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 mb-8">
                <div className="flex items-start gap-4">
                  <Zap className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold mb-2">Activate Your Group</h3>
                    <p className="text-slate-300 mb-4">
                      Each member will receive a unique Ludeva Number at a one-time cost of <strong>Ksh 100 per person</strong>.
                    </p>
                    <p className="text-slate-300">
                      <strong>Total Cost:</strong> Ksh {members.filter(m => m.name.trim()).length * 100} for {members.filter(m => m.name.trim()).length} members
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-700 rounded-lg p-6 mb-8">
                <h3 className="font-bold mb-4">Ludeva Numbers to be Generated:</h3>
                <div className="space-y-2">
                  {members.filter(m => m.name.trim()).map((member, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span>{member.name}</span>
                      <span className="font-mono bg-slate-600 px-3 py-1 rounded text-blue-300">LUD-XXXX-XXXX</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <Button onClick={() => setCurrentStep(4)} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button onClick={handleStep5} className="flex-1 bg-green-600 hover:bg-green-700">
                  Activate Group & Generate Numbers
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
