import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Chip,
  Card,
  CardContent,
  Checkbox,
  Tooltip,
} from '@mui/material';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  HelpCircle,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { BirthProfile, CreateBirthProfileDto } from '../../types/birth-data';
import { CreateBirthProfileWizard } from './CreateBirthProfileWizard';

interface BirthProfileManagerModalProps {
  open: boolean;
  onClose: () => void;
  profiles: BirthProfile[];
  selectedProfileIds: string[];
  onSelectProfiles: (ids: string[]) => void;
  onSaveProfile: (dto: CreateBirthProfileDto, editingId?: string) => void;
  onDeleteProfile: (id: string) => void;
  isSelectionMode?: boolean; // When triggered as part of the chart generation flow
  onConfirmSelection?: () => void;
}

export const BirthProfileManagerModal: React.FC<BirthProfileManagerModalProps> = ({
  open,
  onClose,
  profiles,
  selectedProfileIds,
  onSelectProfiles,
  onSaveProfile,
  onDeleteProfile,
  isSelectionMode = false,
  onConfirmSelection,
}) => {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<BirthProfile | null>(null);

  const handleOpenCreateWizard = () => {
    setEditingProfile(null);
    setWizardOpen(true);
  };

  const handleOpenEditWizard = (profile: BirthProfile, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProfile(profile);
    setWizardOpen(true);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this birth profile?')) {
      onDeleteProfile(id);
    }
  };

  const toggleProfileSelection = (id: string) => {
    if (selectedProfileIds.includes(id)) {
      onSelectProfiles(selectedProfileIds.filter((pId) => pId !== id));
    } else {
      // Allow single or multiple selection
      onSelectProfiles([...selectedProfileIds, id]);
    }
  };

  const formatDateDisplay = (isoDate: string) => {
    try {
      const [y, m, d] = isoDate.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return isoDate;
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        aria-labelledby="birth-data-manager-title"
      >
        <DialogTitle
          id="birth-data-manager-title"
          component="div"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #1A1A1A',
            py: 2.2,
            px: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: 'rgba(224, 201, 154, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#E0C99A',
              }}
            >
              <Users size={18} />
            </Box>
            <Box>
              <Typography variant="h6" component="div" sx={{ fontFamily: '"Cinzel", serif', fontWeight: 600, color: '#EDF1F7', lineHeight: 1.1 }}>
                Birth Data
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={handleOpenCreateWizard}
              startIcon={<Plus size={16} />}
              sx={{
                borderColor: '#E0C99A',
                color: '#E0C99A',
                px: 2,
                borderRadius: 20,
                fontSize: '0.8125rem',
              }}
            >
              Create New
            </Button>
            <IconButton onClick={onClose} size="small" sx={{ color: '#94A3B8' }} aria-label="Close dialog">
              <X size={20} />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: '24px !important', pb: 3, px: 3, minHeight: 340 }}>
          {profiles.length === 0 ? (
            /* EMPTY STATE AS SPECIFIED IN SPEC */
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  backgroundColor: '#131A2A',
                  border: '1px dashed #2A364F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94A3B8',
                  mb: 2.5,
                }}
              >
                <Users size={28} />
              </Box>
              <Typography variant="h6" sx={{ fontFamily: '"Cinzel", serif', color: '#EDF1F7', mb: 1 }}>
                No birth data yet.
              </Typography>
              <Typography variant="body2" sx={{ color: '#94A3B8', maxWidth: 400, mb: 3 }}>
                Create a birth profile to use it for your metaphysical charts. Birth data is saved securely and reusable across all systems.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenCreateWizard}
                startIcon={<Plus size={16} />}
              >
                Create New Profile
              </Button>
            </Box>
          ) : (
            /* PROFILES LIST */
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {profiles.map((profile) => {
                const isSelected = selectedProfileIds.includes(profile.id);

                return (
                  <Card
                    key={profile.id}
                    onClick={() => toggleProfileSelection(profile.id)}
                    sx={{
                      cursor: 'pointer',
                      border: isSelected ? '1.5px solid #E0C99A' : '1px solid #1C1C1C',
                      backgroundColor: isSelected ? 'rgba(224, 201, 154, 0.05)' : '#080808',
                      transition: 'all 0.18s ease-in-out',
                      '&:hover': {
                        borderColor: isSelected ? '#E0C99A' : '#333333',
                        backgroundColor: isSelected ? 'rgba(224, 201, 154, 0.08)' : '#0F0F0F',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          {/* Selection Checkbox */}
                          <Checkbox
                            checked={isSelected}
                            onChange={() => toggleProfileSelection(profile.id)}
                            onClick={(e) => e.stopPropagation()}
                            sx={{
                              p: 0,
                              mt: 0.2,
                              color: '#4B5565',
                              '&.Mui-checked': { color: '#E0C99A' },
                            }}
                          />

                          <Box>
                            {/* Profile Name & Relationship Tag */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.6 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#EDF1F7' }}>
                                {profile.name}
                              </Typography>
                              <Chip
                                label={profile.relationship}
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: '0.7rem',
                                  backgroundColor: profile.relationship === 'Myself' ? 'rgba(224, 201, 154, 0.15)' : '#1A2338',
                                  color: profile.relationship === 'Myself' ? '#E0C99A' : '#94A3B8',
                                  border: '1px solid',
                                  borderColor: profile.relationship === 'Myself' ? 'rgba(224, 201, 154, 0.3)' : '#283755',
                                }}
                              />
                            </Box>

                            {/* Date and Time (CRITICAL: displays Unknown explicitly, NEVER 00:00) */}
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, color: '#94A3B8' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                                <Calendar size={14} />
                                <Typography variant="body2" sx={{ color: '#D4DCED' }}>
                                  {formatDateDisplay(profile.birthDate)}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#64748B' }}>
                                  ·
                                </Typography>
                                <Clock size={14} />
                                {profile.isTimeUnknown || !profile.birthTime ? (
                                  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                                    <Typography variant="body2" sx={{ color: '#FBBF24', fontStyle: 'italic' }}>
                                      Unknown
                                    </Typography>
                                    <Tooltip title="Unknown birth time (null). Not assumed as midnight.">
                                      <HelpCircle size={12} className="text-amber-400" />
                                    </Tooltip>
                                  </Box>
                                ) : (
                                  <Typography variant="body2" sx={{ color: '#D4DCED', fontFamily: '"JetBrains Mono", monospace' }}>
                                    {profile.birthTime}
                                  </Typography>
                                )}
                              </Box>

                              {/* Place and Country */}
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                                <MapPin size={14} />
                                <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                                  {profile.birthPlace}, {profile.country}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Box>

                        {/* Card Actions: Edit, Delete */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Tooltip title="Edit Profile">
                            <IconButton
                              size="small"
                              onClick={(e) => handleOpenEditWizard(profile, e)}
                              sx={{ color: '#94A3B8', '&:hover': { color: '#EDF1F7', backgroundColor: '#1A2338' } }}
                            >
                              <Edit2 size={16} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Profile">
                            <IconButton
                              size="small"
                              onClick={(e) => handleDelete(profile.id, e)}
                              sx={{ color: '#94A3B8', '&:hover': { color: '#F87171', backgroundColor: 'rgba(248, 113, 113, 0.1)' } }}
                            >
                              <Trash2 size={16} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #1A1A1A', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ color: '#94A3B8' }}>
              {selectedProfileIds.length} of {profiles.length} profile(s) selected
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button onClick={onClose} sx={{ color: '#94A3B8' }}>
              Close
            </Button>
            {isSelectionMode && (
              <Button
                variant="contained"
                color="primary"
                disabled={selectedProfileIds.length === 0}
                onClick={() => {
                  if (onConfirmSelection) onConfirmSelection();
                }}
                startIcon={<CheckCircle2 size={16} />}
              >
                Use Selected
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>

      {/* 3-Step Create/Edit Wizard Modal */}
      <CreateBirthProfileWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onSave={onSaveProfile}
        initialProfile={editingProfile}
      />
    </>
  );
};
