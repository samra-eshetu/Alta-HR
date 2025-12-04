
import ProfileForm from "@/components/Forms/profileForm";
import LeaveForm from "@/components/Forms/leaveForm";
import ModalForms from "@/components/modalForm";

export default function FormsDashboard() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-4">
          Employee Forms Portal
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Click any card to open and submit a form
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Profile Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow text-center">
            <h3 className="text-2xl font-semibold mb-6">
              Add Employee Profile
            </h3>
            <ModalForms
              title="Add Employee Profile"
              triggerLabel="Open Profile Form"
            >
              <ProfileForm />
            </ModalForms>
          </div>

          {/* Leave Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow text-center">
            <h3 className="text-2xl font-semibold mb-6">Request Leave</h3>
            <ModalForms
              title="Leave Request Form"
              triggerLabel="Open Leave Form"
            >
              <LeaveForm />
            </ModalForms>
          </div>

          {/* Add more forms just like this */}
        </div>
      </div>
    </div>
  );
}
