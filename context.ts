import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { TrendingUp, Users, Wallet, FileText, Download, Calendar } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function MemberDashboard() {
  const { user } = useAuth();
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [showDateFilter, setShowDateFilter] = useState(false);

  // Fetch member data
  const { data: memberData, isLoading: memberLoading } = trpc.members.getById.useQuery(
    { memberId: selectedMemberId || 0 },
    { enabled: !!selectedMemberId }
  );

  // Fetch contributions
  const { data: contributions } = trpc.contributions.getByMember.useQuery(
    { memberId: selectedMemberId || 0 },
    { enabled: !!selectedMemberId }
  );

  // Fetch reconciliation
  const { data: reconciliations } = trpc.reconciliations.getByMember.useQuery(
    { memberId: selectedMemberId || 0 },
    { enabled: !!selectedMemberId }
  );

  if (!memberData || !selectedMemberId) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6">Member Dashboard</h1>
          <Card className="p-8 text-center">
            <p className="text-slate-500">Select a group to view your dashboard</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const totalContributed = parseFloat(memberData.totalContributed);
  const totalDisbursed = parseFloat(memberData.totalDisbursed);
  const platformFeeDeducted = parseFloat(memberData.platformFeeDeducted);
  const outstandingBalance = parseFloat(memberData.outstandingBalance);

  // Filter contributions by date range
  const getFilteredContributions = () => {
    if (!contributions) return [];
    if (!startDate && !endDate) return contributions;

    return contributions.filter((c) => {
      const contribDate = new Date(c.contributionDate);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && contribDate < start) return false;
      if (end) {
        const endDateWithTime = new Date(end);
        endDateWithTime.setHours(23, 59, 59, 999);
        if (contribDate > endDateWithTime) return false;
      }
      return true;
    });
  };

  // Filter reconciliations by date range
  const getFilteredReconciliations = () => {
    if (!reconciliations) return [];
    if (!startDate && !endDate) return reconciliations;

    return reconciliations.filter((rec) => {
      // Parse period string (e.g., "January 2024" or "2024-01")
      const periodDate = new Date(rec.reconciliationPeriod);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && periodDate < start) return false;
      if (end) {
        const endDateWithTime = new Date(end);
        endDateWithTime.setHours(23, 59, 59, 999);
        if (periodDate > endDateWithTime) return false;
      }
      return true;
    });
  };

  // PDF Export Handler
  const handleExportPDF = async () => {
    if (!memberData) return;

    // Validate date range
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      toast.error("Start date must be before end date");
      return;
    }
    
    setIsExporting(true);
    try {
      const filteredContributions = getFilteredContributions();
      const filteredReconciliations = getFilteredReconciliations();

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 20;

      // Header
      doc.setFontSize(24);
      doc.setTextColor(30, 144, 255); // Blue color
      doc.text("Ludeva - Team", pageWidth / 2, yPosition, { align: "center" });
      
      yPosition += 10;
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      const dateRangeText = startDate || endDate 
        ? `Statement for Period: ${startDate || "Start"} to ${endDate || "End"}`
        : "Member Account Statement & History";
      doc.text(dateRangeText, pageWidth / 2, yPosition, { align: "center" });

      // Member Info
      yPosition += 15;
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text(`Member: ${memberData.memberName || ""}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Ludeva Number: ${memberData.ludevaNumber || "Pending"}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Slot Number: ${memberData.slotNumber || "Not assigned"}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Phone: ${memberData.memberPhone || "N/A"}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Email: ${memberData.memberEmail || "N/A"}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 20, yPosition);

      // Summary Section
      yPosition += 12;
      doc.setFontSize(12);
      (doc as any).setFont(undefined, "bold");
      doc.text("Account Summary", 20, yPosition);
      yPosition += 8;
      (doc as any).setFont(undefined, "normal");
      doc.setFontSize(10);
      
      const summaryData: (string | number)[][] = [
        ["Total Contributed", `Ksh ${totalContributed.toLocaleString()}`],
        ["Total Received", `Ksh ${totalDisbursed.toLocaleString()}`],
        ["Platform Fee (5%)", `Ksh ${platformFeeDeducted.toLocaleString()}`],
        ["Outstanding Balance", `Ksh ${outstandingBalance.toLocaleString()}`],
      ];

      (doc as any).autoTable({
        startY: yPosition,
        head: [["Description", "Amount"]],
        body: summaryData,
        theme: "grid",
        headStyles: {
          fillColor: [30, 144, 255],
          textColor: [255, 255, 255],
          fontStyle: "bold" as any,
        },
        bodyStyles: {
          textColor: [0, 0, 0],
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240],
        },
        margin: { left: 20, right: 20 },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 12;

      // Contribution History Section
      if (filteredContributions && filteredContributions.length > 0) {
        doc.setFontSize(12);
        (doc as any).setFont(undefined, "bold");
        doc.text("Contribution History", 20, yPosition);
        yPosition += 8;
        (doc as any).setFont(undefined, "normal");

        const contributionData: (string | number)[][] = filteredContributions.map((c) => [
          new Date(c.contributionDate).toLocaleDateString(),
          `Ksh ${parseFloat(c.amount).toLocaleString()}`,
          c.status.charAt(0).toUpperCase() + c.status.slice(1),
          c.transactionRef || "—",
        ]);

        (doc as any).autoTable({
          startY: yPosition,
          head: [["Date", "Amount", "Status", "Reference"]],
          body: contributionData,
          theme: "grid",
          headStyles: {
            fillColor: [30, 144, 255],
            textColor: [255, 255, 255],
            fontStyle: "bold" as any,
          },
          bodyStyles: {
            textColor: [0, 0, 0],
          },
          alternateRowStyles: {
            fillColor: [240, 240, 240],
          },
          margin: { left: 20, right: 20 },
        });

        yPosition = (doc as any).lastAutoTable.finalY + 12;
      }

      // Account Statements Section
      if (filteredReconciliations && filteredReconciliations.length > 0) {
        doc.addPage();
        yPosition = 20;
        
        doc.setFontSize(12);
        (doc as any).setFont(undefined, "bold");
        doc.text("Account Statements", 20, yPosition);
        yPosition += 8;
        (doc as any).setFont(undefined, "normal");

        const statementData: (string | number)[][] = filteredReconciliations.map((rec) => [
          rec.reconciliationPeriod,
          `Ksh ${parseFloat(rec.totalContributions).toLocaleString()}`,
          `Ksh ${parseFloat(rec.totalDisbursements).toLocaleString()}`,
          `Ksh ${parseFloat(rec.platformFeeDeducted).toLocaleString()}`,
          `Ksh ${parseFloat(rec.netBalance).toLocaleString()}`,
        ]);

        (doc as any).autoTable({
          startY: yPosition,
          head: [["Period", "Contributions", "Disbursements", "Fee (5%)", "Net Balance"]],
          body: statementData,
          theme: "grid",
          headStyles: {
            fillColor: [30, 144, 255],
            textColor: [255, 255, 255],
            fontStyle: "bold" as any,
          },
          bodyStyles: {
            textColor: [0, 0, 0],
          },
          alternateRowStyles: {
            fillColor: [240, 240, 240],
          },
          margin: { left: 20, right: 20 },
        });
      }

      // Footer
      const pageCount = (doc as any).internal.getPages().length;
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Page ${i} of ${pageCount}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: "center" }
        );
        doc.text(
          "This document contains confidential financial information. © Ludeva - Team",
          pageWidth / 2,
          pageHeight - 5,
          { align: "center" }
        );
      }

      // Save PDF
      const dateRangeStr = startDate || endDate 
        ? `-${startDate || "start"}-to-${endDate || "end"}`
        : "";
      const fileName = `Ludeva-Statement-${memberData.memberName || "Member"}${dateRangeStr}-${new Date().toISOString().split("T")[0]}.pdf`;
      doc.save(fileName);
      toast.success("Statement exported successfully!");
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Failed to export statement");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Account</h1>
          <p className="text-slate-500">Ludeva Number: <span className="font-mono font-bold text-blue-400">{memberData.ludevaNumber || "Pending"}</span></p>
          <p className="text-slate-500">Slot Number: <span className="font-bold">{memberData.slotNumber || "Not assigned"}</span></p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Contributed</p>
                <p className="text-2xl font-bold">Ksh {totalContributed.toLocaleString()}</p>
              </div>
              <Wallet className="w-8 h-8 text-blue-400 opacity-50" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Received</p>
                <p className="text-2xl font-bold">Ksh {totalDisbursed.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400 opacity-50" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Platform Fee (5%)</p>
                <p className="text-2xl font-bold">Ksh {platformFeeDeducted.toLocaleString()}</p>
              </div>
              <FileText className="w-8 h-8 text-orange-400 opacity-50" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Outstanding Balance</p>
                <p className="text-2xl font-bold">Ksh {outstandingBalance.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-purple-400 opacity-50" />
            </div>
          </Card>
        </div>

        {/* Date Range Filter & Export */}
        <Card className="border-slate-700 mb-8 p-6 bg-slate-900/50">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-semibold text-slate-300 mb-2 block">
                <Calendar className="w-4 h-4 inline mr-2" />
                Filter by Date Range (Optional)
              </label>
              <div className="flex gap-3 flex-col md:flex-row">
                <div className="flex-1">
                  <label className="text-xs text-slate-400 block mb-1">Start Date</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-slate-800 border-slate-700 focus:border-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-slate-400 block mb-1">End Date</label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-slate-800 border-slate-700 focus:border-blue-500"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                  }}
                  className="border-slate-600 hover:border-slate-500"
                >
                  Clear
                </Button>
              </div>
            </div>
            <Button 
              className="gap-2 bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
              onClick={handleExportPDF}
              disabled={isExporting}
            >
              <Download className="w-4 h-4" />
              {isExporting ? "Exporting..." : "Export as PDF"}
            </Button>
          </div>
        </Card>

        {/* Contribution History */}
        <Card className="border-slate-700 mb-8">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-bold">
              Contribution History
              {(startDate || endDate) && (
                <span className="text-sm font-normal text-slate-400 ml-2">
                  ({startDate ? new Date(startDate).toLocaleDateString() : "Start"} - {endDate ? new Date(endDate).toLocaleDateString() : "End"})
                </span>
              )}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-700">
                <tr className="text-slate-400">
                  <th className="text-left p-4 font-semibold">Date</th>
                  <th className="text-left p-4 font-semibold">Amount</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Reference</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredContributions().length > 0 ? (
                  getFilteredContributions().map((contribution) => (
                    <tr key={contribution.id} className="border-b border-slate-700/50 hover:bg-slate-800/50">
                      <td className="p-4">{new Date(contribution.contributionDate).toLocaleDateString()}</td>
                      <td className="p-4 font-semibold">Ksh {parseFloat(contribution.amount).toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          contribution.status === "completed" ? "bg-green-500/20 text-green-400" :
                          contribution.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-red-500/20 text-red-400"
                        }`}>
                          {contribution.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400">{contribution.transactionRef || "—"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-slate-400">
                      {contributions && contributions.length > 0 
                        ? "No contributions in the selected date range" 
                        : "No contributions yet"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Account Statements */}
        <Card className="border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-bold">Account Statements</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-700">
                <tr className="text-slate-400">
                  <th className="text-left p-4 font-semibold">Period</th>
                  <th className="text-left p-4 font-semibold">Contributions</th>
                  <th className="text-left p-4 font-semibold">Disbursements</th>
                  <th className="text-left p-4 font-semibold">Fee (5%)</th>
                  <th className="text-left p-4 font-semibold">Net Balance</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredReconciliations().length > 0 ? (
                  getFilteredReconciliations().map((rec) => (
                    <tr key={rec.id} className="border-b border-slate-700/50 hover:bg-slate-800/50">
                      <td className="p-4">{rec.reconciliationPeriod}</td>
                      <td className="p-4">Ksh {parseFloat(rec.totalContributions).toLocaleString()}</td>
                      <td className="p-4">Ksh {parseFloat(rec.totalDisbursements).toLocaleString()}</td>
                      <td className="p-4 text-orange-400">Ksh {parseFloat(rec.platformFeeDeducted).toLocaleString()}</td>
                      <td className="p-4 font-semibold">Ksh {parseFloat(rec.netBalance).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-400">
                      {reconciliations && reconciliations.length > 0 
                        ? "No statements in the selected date range" 
                        : "No statements available"}
                    </td>
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
