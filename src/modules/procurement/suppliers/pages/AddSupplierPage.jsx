import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, TriangleAlert, X } from 'lucide-react';
import { useTenant } from '../../../../context/TenantContext';
import { useCreateSupplier } from '../hooks/suppliers.hooks';

const inputClass =
  'w-full rounded-md border border-[#ddd0c1] bg-[#fdfbf8] px-3 py-2.5 text-sm text-[#2a1a10] placeholder:text-[#b8a898] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#7a4a2a]';

const SectionTitle = ({ title, step }) => (
  <div className="flex items-center justify-between border-b border-[#f1ebe3] pb-2">
    <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#2a1a10]">{title}</h3>
    <span className="font-mono text-[10px] text-[#8a7b6f]">{step}</span>
  </div>
);

const Field = ({ label, required, hint, optional, children }) => (
  <div>
    <div className="mb-1.5 flex items-center justify-between">
      <label className="text-xs font-semibold text-[#2a1a10]">
        {label}
        {required && <span className="ml-0.5 text-red-600">*</span>}
      </label>
      {optional && <span className="font-mono text-[10px] text-[#8a7b6f]">Optional</span>}
    </div>
    {children}
    {hint && <p className="mt-1 text-[11px] text-[#8a7b6f]">{hint}</p>}
  </div>
);

// Opens as a slide-over panel on top of the Suppliers list (route: /suppliers/add)
export const AddSupplierPage = () => {
  const navigate = useNavigate();
  const { currentOrg } = useTenant();
  const { mutate: saveSupplier, isPending, error } = useCreateSupplier();

  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', status: 'ACTIVE' });

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  const close = () => navigate('/suppliers');

  // Esc key closes the panel
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && navigate('/suppliers');
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      status: form.status,
      ...(form.email.trim() && { email: form.email.trim() }),
      ...(form.address.trim() && { address: form.address.trim() }),
    };

    saveSupplier(
      { orgId: currentOrg?._id, data },
      { onSuccess: () => navigate('/suppliers', { replace: true }) }
    );
  };

  const errorMessage = error?.response?.data?.message || (error ? 'Failed to save supplier. Please try again.' : '');

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#2a1a10]/30 backdrop-blur-[2px]" onClick={close} />

      {/* Panel */}
      <aside className="relative flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#ece4da] bg-[#fbf8f4] px-6 py-5">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6b5d52]">
              Procurement Registry
            </p>
            <h2 className="mt-1 font-serif text-2xl font-bold text-[#2a1a10]">Add New Supplier</h2>
            <p className="mt-1 text-xs text-[#6b5d52]">
              Register a vendor or timber concessionaire for {currentOrg?.name || 'this workspace'} to use in purchase
              orders and goods receipts.
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#e2d6c8] bg-white text-[#3b2213] transition-colors hover:bg-[#f6f0e9] cursor-pointer"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-7 overflow-y-auto px-6 py-5">
            {errorMessage && (
              <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                <TriangleAlert className="mt-px h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Step 1 */}
            <section className="space-y-4">
              <SectionTitle title="Entity Identification" step="Step 1 of 3" />
              <Field label="Supplier Name" required>
                <input
                  type="text"
                  required
                  autoFocus
                  value={form.name}
                  onChange={update('name')}
                  placeholder="e.g. Bengal Teak Traders Ltd."
                  className={inputClass}
                />
              </Field>
            </section>

            {/* Step 2 */}
            <section className="space-y-4">
              <SectionTitle title="Contact & Logistics" step="Step 2 of 3" />
              <Field label="Phone Number" required hint="Primary contact number for this supplier.">
                <div className="flex">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-[#ddd0c1] bg-[#f6f0e9] px-3 font-mono text-xs font-semibold text-[#5a3e2b]">
                    BD
                  </span>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={update('phone')}
                    placeholder="01712-345678"
                    className={`${inputClass} rounded-l-none font-mono`}
                  />
                </div>
              </Field>
              <Field label="Email Address" optional>
                <input
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  placeholder="e.g. orders@supplier.com.bd"
                  className={inputClass}
                />
              </Field>
              <Field label="Factory / Office Address" optional>
                <textarea
                  rows={3}
                  value={form.address}
                  onChange={update('address')}
                  placeholder="Road/Pier number, Upazila/Thana, District (e.g. Khatunganj Timber Market, Chattogram)"
                  className={`${inputClass} resize-none`}
                />
              </Field>
            </section>

            {/* Step 3 */}
            <section className="space-y-4">
              <SectionTitle title="Status" step="Step 3 of 3" />
              <div className="flex items-center justify-between rounded-lg border border-[#ece4da] bg-[#fbf8f4] px-4 py-3">
                <div>
                  <p className="text-xs font-semibold text-[#2a1a10]">Operational Status</p>
                  <p className="text-[11px] text-[#8a7b6f]">Inactive suppliers can't be used for new orders.</p>
                </div>
                <div className="flex rounded-md border border-[#e2d6c8] bg-white p-0.5">
                  {['ACTIVE', 'INACTIVE'].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, status: value }))}
                      className={`rounded px-3 py-1 font-mono text-[10px] font-semibold tracking-wider transition-colors cursor-pointer ${
                        form.status === value ? 'bg-[#3b2213] text-white' : 'text-[#6b5d52] hover:bg-[#f6f0e9]'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 border-t border-[#ece4da] bg-[#fbf8f4] px-6 py-4">
            <button
              type="button"
              onClick={close}
              className="rounded-md border border-[#e2d6c8] bg-white px-4 py-2 text-sm font-semibold text-[#3b2213] transition-colors hover:bg-[#f6f0e9] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-md bg-[#3b2213] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#4d2e1a] disabled:opacity-50 cursor-pointer"
            >
              {!isPending && <Check className="h-4 w-4" />}
              {isPending ? 'Saving...' : 'Save Supplier'}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
};
