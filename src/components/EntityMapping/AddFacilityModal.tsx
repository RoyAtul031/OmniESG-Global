import React, { useState } from 'react';
import { FacilityEntity } from '../../types/entity';
import { Tenant } from '../../types/tenant';
import { User } from '../../types/rbac';
import { X, Building, Plus } from 'lucide-react';

interface AddFacilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant;
  users: User[];
  onAddFacility: (newFacility: FacilityEntity, justification: string) => void;
}

export const AddFacilityModal: React.FC<AddFacilityModalProps> = ({
  isOpen,
  onClose,
  tenant,
  users,
  onAddFacility,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('India');
  const [address, setAddress] = useState('');
  const [floorArea, setFloorArea] = useState<number>(150000);
  const [occupancy, setOccupancy] = useState<number>(1500);
  const [contributorId, setContributorId] = useState<string>(users[2]?.id || users[0]?.id || '');
  const [justification, setJustification] = useState('New commercial lease acquisition under operational control.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim() || !city.trim()) return;

    const assignedUser = users.find(u => u.id === contributorId) || users[0];

    const newFacility: FacilityEntity = {
      id: `fac_${tenant.slug}_${Date.now()}`,
      tenantId: tenant.id,
      name: name.trim(),
      code: code.trim().toUpperCase(),
      type: 'FACILITY_PROPERTY',
      country,
      city: city.trim(),
      address: address.trim() || `${city}, ${country}`,
      grossFloorAreaSqFt: Number(floorArea),
      occupancyCount: Number(occupancy),
      assignedManagerId: users[0]?.id || '',
      assignedManagerName: users[0]?.name || '',
      assignedContributorId: assignedUser.id,
      assignedContributorName: assignedUser.name,
      scope1Tco2e: 0,
      scope2Tco2e: 0,
      scope3Tco2e: 0,
      renewableEnergyPercent: 0,
      waterRecycledPercent: 0,
      wasteDivertedPercent: 0,
      reportingStatus: 'NEEDS_DATA',
      hasAnomaly: false,
      meters: [],
    };

    onAddFacility(newFacility, justification);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white">Add Facility Asset to Entity Map</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Facility Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. WeWork Cyber City"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Asset Code (Identifier)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. WW-DEL-02"
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 uppercase font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">City</label>
              <input
                type="text"
                required
                placeholder="e.g. Gurugram"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Country</label>
              <select
                value={country}
                onChange={e => setCountry(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="Japan">Japan</option>
                <option value="Singapore">Singapore</option>
                <option value="United Kingdom">United Kingdom</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Gross Floor Area (sq ft)
              </label>
              <input
                type="number"
                required
                min="1000"
                value={floorArea}
                onChange={e => setFloorArea(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Occupancy Capacity
              </label>
              <input
                type="number"
                required
                min="10"
                value={occupancy}
                onChange={e => setOccupancy(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Assigned Facility Contributor (Field Operator)
            </label>
            <select
              value={contributorId}
              onChange={e => setContributorId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.title})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Regulatory Justification (Mandatory for Audit Trail)
            </label>
            <textarea
              rows={2}
              required
              value={justification}
              onChange={e => setJustification(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="State the business rationale for adding this entity..."
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Entity & Commit Block
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
