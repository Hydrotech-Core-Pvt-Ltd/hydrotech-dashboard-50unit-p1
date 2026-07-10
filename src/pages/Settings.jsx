import { User, Shield, Bell } from "lucide-react";

export default function Settings({ user }) {
  const email = user?.email || "";
  const role = user?.role || "";
  const notifications = true;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 text-sm">Account and application settings</p>
        </div>
      </div>

      <div className="bg-[#0f1e36]/40 rounded-2xl p-6 border border-white/10 max-w-xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-10 w-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
            <User className="text-cyan-300" />
          </div>
          <div>
            <p className="text-white font-semibold">{email || "No email available"}</p>
            <p className="text-xs text-gray-400">Role: {role || "unassigned"}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="text-white/70" />
              <div>
                <p className="text-white">Notifications</p>
                <p className="text-xs text-gray-400">Enable or disable alerts</p>
              </div>
            </div>
            <label className="swap">
              <input type="checkbox" defaultChecked={notifications} />
              <span className="ml-2 text-sm text-gray-300">{notifications ? 'On' : 'Off'}</span>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="text-white/70" />
              <div>
                <p className="text-white">Security</p>
                <p className="text-xs text-gray-400">Change password and roles</p>
              </div>
            </div>
            <button className="text-sm text-cyan-300">Manage</button>
          </div>
        </div>
      </div>
    </div>
  );
}
