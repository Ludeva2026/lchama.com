import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, Wallet, TrendingUp, FileText, Download, Send } from "lucide-react";
import { useState } from "react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  // Fetch group data
  const { data: groupData, isLoading: groupLoading } = trpc.groups.getById.useQuery(
    { groupId: selectedGroupId || 0 },
    { enabled: !!selectedGroupId }
  );

  // Fetch members
  const { data: members } = trpc.members.getByGroup.useQuery(
    { groupId: selectedGroupId || 0 },
    { enabled: !!selectedGroupId }
  );

  // Fetch contributions
  const { data: contributions } = trpc.contributions.getByGroup.useQuery(
    { groupId: selectedGroupId || 0 },
    { enabled: !!selectedGroupId }
  );

  // Fetch disbursements
  const { data: disbursements } = trpc.disbursements.getByGroup.useQuery(
    { groupId: selectedGroupId || 0 },
    { enabled: !!selectedGroupId }
  );

  if (!groupData || !selectedGroupId) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          <Card className="p-8 text-center">
            <p className="text-slate-500">Select a group to view admin dashboard</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate statistics
  const totalMembers = members?.length || 0;
  const totalContributions = contributions?.reduce((sum, c) => sum + parseFloat(c.amount), 0) || 0;
  const totalDisbursed = disbursements?.reduce((sum, d) => sum + parseFloat(d.amount), 0) || 0;
  const groupBalance = totalContributions - totalDisbursed;
  const platformFee = (totalContributions * 5) / 100;

  // Prepare chart data
  const memberContributionData = members?.map(member => ({
    name: member.memberName,
    contributed: parseFloat(member.totalContributed),
    received: parseFloat(member.totalDisbursed),
  })) || [];

  const contributionTrendData = [
    { month: "Jan", amount: 0 },
    { month: "Feb", amount: 0 },
    { month: "Mar", amount: 0 },
    { month: "Apr", amount: 0 },
    { month: "May", amount: 0 },
    { month: "Jun", amount: 0 },
  ];

  const fundDistributionData = [
    { name: "Available Balance", value: groupBalance - platformFee },
    { name: "Platform Fee (5%)", value: platformFee },
  ];

  const COLORS = ["#3b82f6", "#f97316"];

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Group Administration</h1>
          <p className="text-slate-500">Group: <span className="font-bold text-blue-400">{groupData.groupName}</span></p>
          <p className="text-slate-500">Mandate: <span className="font-bold capitalize">{groupData.disbursementMandate}</span></p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Members</p>
                <p className="text-2xl font-bold">{totalMembers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400 opacity-50" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Contributions</p>
                <p className="text-2xl font-bold">Ksh {totalContributions.toLocaleString()}</p>
              </div>
              <Wallet className="w-8 h-8 text-green-400 opacity-50" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Group Balance</p>
                <p className="text-2xl font-bold">Ksh {groupBalance.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400 opacity-50" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Platform Fee (5%)</p>
                <p className="text-2xl font-bold">Ksh {platformFee.toLocaleString()}</p>
              </div>
              <FileText className="w-8 h-8 text-orange-400 opacity-50" />
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="border-slate-700 p-6">
            <h2 className="text-xl font-bold mb-4">Member Contributions vs Disbursements</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={memberContributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Legend />
                <Bar dataKey="contributed" fill="#3b82f6" name="Contributed" />
                <Bar dataKey="received" fill="#10b981" name="Received" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="border-slate-700 p-6">
            <h2 className="text-xl font-bold mb-4">Fund Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={fundDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: Ksh ${value.toLocaleString()}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {fundDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
                  labelStyle={{ color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Members Table */}
        <Card className="border-slate-700 mb-8">
          <div className="p-6 border-b border-slate-700 flex justify-between items-center">
            <h2 className="text-xl font-bold">Member Management</h2>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-700">
                <tr className="text-slate-400">
                  <th className="text-left p-4 font-semibold">Member Name</th>
                  <th className="text-left p-4 font-semibold">Ludeva Number</th>
                  <th className="text-left p-4 font-semibold">Slot</th>
                  <th className="text-left p-4 font-semibold">Contributed</th>
                  <th className="text-left p-4 font-semibold">Received</th>
                  <th className="text-left p-4 font-semibold">Balance</th>
                  <th className="text-left p-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {members && members.length > 0 ? (
                  members.map((member) => (
                    <tr key={member.id} className="border-b border-slate-700/50 hover:bg-slate-800/50">
                      <td className="p-4 font-semibold">{member.memberName}</td>
                      <td className="p-4 font-mono text-blue-400">{member.ludevaNumber || "Pending"}</td>
                      <td className="p-4">{member.slotNumber || "—"}</td>
                      <td className="p-4">Ksh {parseFloat(member.totalContributed).toLocaleString()}</td>
                      <td className="p-4">Ksh {parseFloat(member.totalDisbursed).toLocaleString()}</td>
                      <td className="p-4 font-semibold">Ksh {parseFloat(member.outstandingBalance).toLocaleString()}</td>
                      <td className="p-4">
                        <Button variant="outline" size="sm">View</Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-slate-400">No members yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Disbursement Management */}
        <Card className="border-slate-700">
          <div className="p-6 border-b border-slate-700 flex justify-between items-center">
            <h2 className="text-xl font-bold">Disbursement Management</h2>
            <Button className="gap-2 bg-green-600 hover:bg-green-700">
              <Send className="w-4 h-4" />
              Process Payout
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-700">
                <tr className="text-slate-400">
                  <th className="text-left p-4 font-semibold">Member</th>
                  <th className="text-left p-4 font-semibold">Amount</th>
                  <th className="text-left p-4 font-semibold">Type</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Date</th>
                  <th className="text-left p-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {disbursements && disbursements.length > 0 ? (
                  disbursements.map((disbursement) => (
                    <tr key={disbursement.id} className="border-b border-slate-700/50 hover:bg-slate-800/50">
                      <td className="p-4 font-semibold">Member {disbursement.memberId}</td>
                      <td className="p-4">Ksh {parseFloat(disbursement.amount).toLocaleString()}</td>
                      <td className="p-4 capitalize">{disbursement.disbursementType}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          disbursement.status === "completed" ? "bg-green-500/20 text-green-400" :
                          disbursement.status === "processed" ? "bg-blue-500/20 text-blue-400" :
                          disbursement.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-red-500/20 text-red-400"
                        }`}>
                          {disbursement.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400">{new Date(disbursement.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <Button variant="outline" size="sm">Edit</Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-slate-400">No disbursements yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
