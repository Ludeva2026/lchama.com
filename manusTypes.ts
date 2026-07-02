import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { ArrowRight, Shield, TrendingUp, Users, CheckCircle, Phone, Mail, MapPin, Globe } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/80 border-b border-yellow-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
            Ludeva - Team
          </div>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">Dashboard</Button>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">Get Started</Button>
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Transform Your Merry-Go-Round Into a <span className="bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">Digital Platform</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Ludeva - Team brings transparency, accountability, and digital reconciliation to Kenyan chama groups. Manage contributions, track disbursements, and eliminate disputes with blockchain-grade precision.
            </p>
            <div className="flex gap-4">
              <a href={getLoginUrl()}>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold text-lg px-8 py-6">
                  Start Your Group <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </a>
              <Button variant="outline" className="text-lg px-8 py-6 border-yellow-500 text-yellow-400 hover:bg-yellow-500/10">
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-2xl blur-3xl opacity-10"></div>
            <div className="relative bg-slate-900/50 rounded-2xl p-8 border border-yellow-600/30">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-yellow-500/10 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-yellow-400" />
                  <span>Real-time contribution tracking</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-yellow-500/10 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-yellow-400" />
                  <span>Automated reconciliation</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-yellow-500/10 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-yellow-400" />
                  <span>Slot-based & year-end payouts</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-yellow-500/10 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-yellow-400" />
                  <span>5% transparent platform fee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges & Solutions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Common Merry-Go-Round Challenges</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-slate-900/50 border-yellow-600/30 p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Member Default</h3>
                <p className="text-slate-300">Members who receive payouts early often stop contributing, causing group collapse.</p>
              </div>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mt-4">
              <p className="text-sm text-yellow-300"><strong>Ludeva Solution:</strong> Automated tracking and accountability ensure all members stay committed throughout the cycle.</p>
            </div>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Lack of Transparency</h3>
                <p className="text-slate-300">Manual ledgers lead to disputes over contribution history and balances.</p>
              </div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-4">
              <p className="text-sm text-blue-300"><strong>Ludeva Solution:</strong> Real-time digital ledger visible to all members ensures complete transparency.</p>
            </div>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Accountability Gaps</h3>
                <p className="text-slate-300">Group leaders may mismanage funds without real-time oversight from members.</p>
              </div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-4">
              <p className="text-sm text-blue-300"><strong>Ludeva Solution:</strong> Digital fund management with automated tracking reduces leader-level mismanagement.</p>
            </div>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Reconciliation Errors</h3>
                <p className="text-slate-300">Manual tracking is prone to human error, making year-end reconciliation difficult.</p>
              </div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-4">
              <p className="text-sm text-blue-300"><strong>Ludeva Solution:</strong> Automated digital reconciliation eliminates errors and generates instant account statements.</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Platform Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-slate-800 border-slate-700 p-8 hover:border-blue-500 transition">
            <Shield className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-3">5-Step Onboarding</h3>
            <p className="text-slate-300 text-sm">Structured group formation with exactly 10 members, slot picking, team lead election, and Ludeva number generation at Ksh 100 per person.</p>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-8 hover:border-blue-500 transition">
            <Users className="w-12 h-12 text-cyan-400 mb-4" />
            <h3 className="text-xl font-bold mb-3">Member Dashboard</h3>
            <p className="text-slate-300 text-sm">View your contribution history, slot number, Ludeva number, group fund balance, and upcoming payout schedule in real-time.</p>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-8 hover:border-blue-500 transition">
            <TrendingUp className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-bold mb-3">Admin Dashboard</h3>
            <p className="text-slate-300 text-sm">Team leads get real-time contribution tracking for all members, fund balance overview, and member management tools.</p>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-8 hover:border-blue-500 transition">
            <CheckCircle className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold mb-3">Dual Disbursement</h3>
            <p className="text-slate-300 text-sm">Choose between slot-based periodic payouts or year-end lump-sum distribution based on your group's mandate.</p>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-8 hover:border-blue-500 transition">
            <Shield className="w-12 h-12 text-yellow-400 mb-4" />
            <h3 className="text-xl font-bold mb-3">Reconciliation</h3>
            <p className="text-slate-300 text-sm">Automated account statements showing contributions, disbursements, 5% platform fee, and net balance per member.</p>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-8 hover:border-blue-500 transition">
            <Globe className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-3">Transparency Ledger</h3>
            <p className="text-slate-300 text-sm">All group members can view the complete contribution ledger in real-time to prevent disputes and ensure accountability.</p>
          </Card>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Transparent Pricing</h2>
        <Card className="bg-slate-800 border-slate-700 p-12 max-w-2xl mx-auto">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4">Ludeva Number Generation</h3>
            <div className="text-5xl font-bold text-blue-400 mb-4">Ksh 100</div>
            <p className="text-slate-300 mb-6">One-time cost per group member to activate your group on the platform</p>
            <hr className="border-slate-700 my-8" />
            <h3 className="text-2xl font-bold mb-4">Annual Platform Fee</h3>
            <div className="text-4xl font-bold text-cyan-400 mb-4">5%</div>
            <p className="text-slate-300">Annual management fee on total group savings, clearly deducted in reconciliation statements</p>
          </div>
        </Card>
      </section>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Get In Touch</h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <Card className="bg-slate-800 border-slate-700 p-8">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2">Email</h3>
                  <a href="mailto:teams@ludevaplc.co.ke" className="text-blue-400 hover:text-blue-300 break-all">
                    teams@ludevaplc.co.ke
                  </a>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-800 border-slate-700 p-8">
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-cyan-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2">Phone</h3>
                  <div className="space-y-2">
                    <a href="tel:0732722101" className="text-cyan-400 hover:text-cyan-300 block">
                      0732722101
                    </a>
                    <a href="tel:0718111989" className="text-cyan-400 hover:text-cyan-300 block">
                      0718 111989
                    </a>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-800 border-slate-700 p-8">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2">Head Office</h3>
                  <p className="text-slate-300">
                    Legacy Plaza<br />
                    Salama Police Road<br />
                    Homabay Town, Kenya
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-800 border-slate-700 p-8">
              <div className="flex items-start gap-4">
                <Globe className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2">Website</h3>
                  <a href="https://www.ludevaplc.co.ke" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 break-all">
                    www.ludevaplc.co.ke
                  </a>
                </div>
              </div>
            </Card>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-3xl opacity-10"></div>
            <Card className="relative bg-slate-800 border-slate-700 p-12">
              <h3 className="text-2xl font-bold mb-6">Ready to Transform Your Chama?</h3>
              <p className="text-slate-300 mb-8">
                Join hundreds of merry-go-round groups across Kenya who have already digitized their operations with Ludeva - Team. Experience transparency, accountability, and seamless reconciliation.
              </p>
              <a href={getLoginUrl()}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6">
                  Start Your Free Trial <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </a>
              <p className="text-sm text-slate-400 text-center mt-4">
                No credit card required. Set up your first group in minutes.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Ludeva - Team</h4>
              <p className="text-slate-400 text-sm">Transforming merry-go-round groups across Kenya with digital innovation.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2026 Ludeva - Team. All rights reserved. | Empowering Kenyan Chamas with Digital Innovation</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
