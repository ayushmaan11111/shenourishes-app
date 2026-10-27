import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  X, 
  Upload, 
  Trash2, 
  Calendar, 
  Scale, 
  Plus, 
  Users,
  Film
} from 'lucide-react';
import { 
  getProgressPhotos, 
  addProgressPhoto, 
  deleteProgressPhoto 
} from '../../services/clientProgressPhotoService';
import type { ClientProgressPhotoItem } from '../../types/longTermSupport';
import type { CustomerRecord } from '../../types/customer';

interface AdminClientPhotoScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: CustomerRecord[];
  initialClientId?: string;
  onOpenTransformationVideo?: (imageUrl: string) => void;
}

export const AdminClientPhotoScannerModal: React.FC<AdminClientPhotoScannerModalProps> = ({
  isOpen,
  onClose,
  clients,
  initialClientId = 'default',
  onOpenTransformationVideo,
}) => {
  const [selectedClientId, setSelectedClientId] = useState<string>(initialClientId);
  const [photos, setPhotos] = useState<ClientProgressPhotoItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Front' | 'Side' | 'Back' | 'Scanner / Other'>('All');
  
  // New upload form
  const [photoType, setPhotoType] = useState<'Front' | 'Side' | 'Back' | 'Scanner / Other'>('Front');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [weightKg, setWeightKg] = useState<string>('65');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const currentClient = clients.find(c => c.uid === selectedClientId) || clients[0];
  const clientName = currentClient?.personalDetails?.fullName || 'Client';

  const loadPhotos = async (cid: string) => {
    try {
      const list = await getProgressPhotos(cid);
      setPhotos(list);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    if (selectedClientId) {
      loadPhotos(selectedClientId);
    }
  }, [selectedClientId]);

  if (!isOpen) return null;

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) return;
    setIsSubmitting(true);
    try {
      const placeholderImg = imageUrl.trim() || (
        photoType === 'Front' 
          ? 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80'
          : photoType === 'Side'
          ? 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80'
          : 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80'
      );

      await addProgressPhoto(selectedClientId, {
        date,
        photoType,
        imageUrl: placeholderImg,
        weightKg: weightKg ? parseFloat(weightKg) : undefined,
        notes: notes.trim(),
        uploadedBy: 'Admin',
      });

      await loadPhotos(selectedClientId);
      setImageUrl('');
      setNotes('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (photoId: string) => {
    if (window.confirm('Delete this progress picture?')) {
      await deleteProgressPhoto(selectedClientId, photoId);
      await loadPhotos(selectedClientId);
    }
  };

  const filteredPhotos = activeFilter === 'All' 
    ? photos 
    : photos.filter(p => p.photoType === activeFilter);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 28, 68, 0.72)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1050,
        padding: '16px',
      }}
    >
      <div
        className="wellness-card animate-scale-up"
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '92vh',
          backgroundColor: '#FFFDF9',
          borderRadius: '20px',
          border: '2px solid #0A1C44',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.22)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#0A1C44',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(232, 202, 86, 0.2)',
                color: '#E8CA56',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Camera size={20} />
            </div>
            <div>
              <span style={{ fontSize: '10.5px', color: '#E8CA56', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                ADMIN CLIENT SCANNER
              </span>
              <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Client Progress Photo Upload & Visual Scanner
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.12)',
              border: 'none',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Client Selection Bar */}
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: '#FAF8F0',
            borderBottom: '1px solid #ECEAE0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={16} color="#0A1C44" />
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#242820' }}>Select Client:</span>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              style={{
                fontSize: '12.5px',
                fontWeight: 700,
                color: '#0A1C44',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1.5px solid #0A1C44',
                backgroundColor: '#FFFFFF',
                cursor: 'pointer',
              }}
            >
              {clients.map(c => (
                <option key={c.uid} value={c.uid}>
                  {c.personalDetails?.fullName || 'Client'} ({c.personalDetails?.mobileNumber || c.uid.slice(0, 6)})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11.5px', color: '#64748B' }}>
              Showing {photos.length} progress scans for <strong>{clientName}</strong>
            </span>
          </div>
        </div>

        {/* Main Body Grid */}
        <div style={{ flex: 1, padding: '18px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Upload New Photo Form */}
          <form
            onSubmit={handleAddPhoto}
            style={{
              padding: '16px',
              borderRadius: '14px',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #D9D8CC',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={16} color="#0A1C44" />
                <h3 style={{ fontSize: '13.5px', fontWeight: 800, color: '#0A1C44', margin: 0 }}>
                  Upload / Scan New Photo for {clientName}
                </h3>
              </div>
              <span style={{ fontSize: '11px', color: '#64748B' }}>Front, Side, Back or Body Scanner</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '11px' }}>Angle / Type</label>
                <select
                  value={photoType}
                  onChange={(e) => setPhotoType(e.target.value as any)}
                  className="form-select"
                  style={{ fontSize: '11.5px', padding: '6px 8px' }}
                >
                  <option value="Front">Front View</option>
                  <option value="Side">Side View</option>
                  <option value="Back">Back View</option>
                  <option value="Scanner / Other">Scanner / InBody / Other</option>
                </select>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '11px' }}>Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '11.5px', padding: '5px 8px' }}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '11px' }}>Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 64.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '11.5px', padding: '5px 8px' }}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '11px' }}>Image URL / Cloud Link</label>
                <input
                  type="url"
                  placeholder="Paste URL or leave empty for sample"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '11.5px', padding: '5px 8px' }}
                />
              </div>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '11px' }}>Clinical Observation Notes</label>
              <input
                type="text"
                placeholder="e.g. Noticeable waist narrowing, improved shoulder symmetry, reduced abdominal distention"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="form-input"
                style={{ fontSize: '11.5px', padding: '6px 10px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Upload size={13} />
                <span>{isSubmitting ? 'Uploading...' : 'Save & Publish Scan to Client'}</span>
              </button>
            </div>
          </form>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', marginRight: '4px' }}>View Angle:</span>
            {(['All', 'Front', 'Side', 'Back', 'Scanner / Other'] as const).map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFilter(f)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  backgroundColor: activeFilter === f ? '#0A1C44' : '#F1EEDF',
                  color: activeFilter === f ? '#FFFFFF' : '#242820',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Photo Gallery Grid */}
          {filteredPhotos.length === 0 ? (
            <div style={{ padding: '36px', textAlign: 'center', backgroundColor: '#FAF8F0', borderRadius: '12px', border: '1px dashed #CBD5E1' }}>
              <Camera size={36} color="#94A3B8" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>No progress photos found for this filter</div>
              <p style={{ fontSize: '11.5px', color: '#64748B', margin: '4px 0 0' }}>
                Use the form above to add Front, Side, or Back progress photos for {clientName}.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  style={{
                    borderRadius: '12px',
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #E2E8F0',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', height: '200px', backgroundColor: '#0B1E48' }}>
                    <img
                      src={photo.imageUrl}
                      alt={photo.photoType}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(10, 28, 68, 0.85)',
                        color: '#E8CA56',
                        fontSize: '10.5px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      {photo.photoType}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDelete(photo.id)}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(239, 68, 68, 0.9)',
                        color: '#FFFFFF',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                      title="Delete picture"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                        <Calendar size={12} />
                        <span>{photo.date}</span>
                      </div>
                      {photo.weightKg && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: '#0A1C44', fontWeight: 800 }}>
                          <Scale size={12} />
                          <span>{photo.weightKg} kg</span>
                        </div>
                      )}
                    </div>

                    {photo.notes && (
                      <p style={{ fontSize: '11px', color: '#334155', margin: '4px 0 0', lineHeight: 1.35, fontStyle: 'italic' }}>
                        "{photo.notes}"
                      </p>
                    )}

                    {onOpenTransformationVideo && (
                      <button
                        type="button"
                        onClick={() => onOpenTransformationVideo(photo.imageUrl)}
                        style={{
                          marginTop: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          padding: '5px 8px',
                          borderRadius: '6px',
                          backgroundColor: '#BE185D',
                          color: '#FFFFFF',
                          fontSize: '10.5px',
                          fontWeight: 700,
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <Film size={11} /> Generate 8–10s Video
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 20px',
            backgroundColor: '#FAF8F0',
            borderTop: '1px solid #ECEAE0',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="btn-primary"
            style={{ fontSize: '12px' }}
          >
            Close Scanner
          </button>
        </div>
      </div>
    </div>
  );
};
