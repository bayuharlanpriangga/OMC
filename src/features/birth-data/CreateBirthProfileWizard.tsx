import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  Stepper,
  Step,
  StepLabel,
  Autocomplete,
  Alert,
  IconButton,
} from '@mui/material';
import { X, Calendar, MapPin, User, Clock, AlertTriangle } from 'lucide-react';
import { BirthLocation, BirthProfile, CreateBirthProfileDto, ProfileRelationship } from '../../types/birth-data';

interface CreateBirthProfileWizardProps {
  open: boolean;
  onClose: () => void;
  onSave: (profileDto: CreateBirthProfileDto, editingId?: string) => void;
  initialProfile?: BirthProfile | null;
}

// Curated geographic coordinate database for instant, frictionless selection
const POPULAR_LOCATIONS: BirthLocation[] = [
  { placeName: 'Kuningan', country: 'Indonesia', latitude: -6.9757, longitude: 108.4839, timezone: 'Asia/Jakarta' },
  { placeName: 'Jakarta', country: 'Indonesia', latitude: -6.2088, longitude: 106.8456, timezone: 'Asia/Jakarta' },
  { placeName: 'Bali / Denpasar', country: 'Indonesia', latitude: -8.6705, longitude: 115.2126, timezone: 'Asia/Makassar' },
  { placeName: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
  { placeName: 'New York City, NY', country: 'United States', latitude: 40.7128, longitude: -74.006, timezone: 'America/New_York' },
  { placeName: 'Los Angeles, CA', country: 'United States', latitude: 34.0522, longitude: -118.2437, timezone: 'America/Los_Angeles' },
  { placeName: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris' },
  { placeName: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo' },
  { placeName: 'Singapore', country: 'Singapore', latitude: 1.3521, longitude: 103.8198, timezone: 'Asia/Singapore' },
  { placeName: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney' },
  { placeName: 'Florence', country: 'Italy', latitude: 43.7696, longitude: 11.2558, timezone: 'Europe/Rome' },
  { placeName: 'Berlin', country: 'Germany', latitude: 52.52, longitude: 13.405, timezone: 'Europe/Berlin' },
  { placeName: 'Toronto', country: 'Canada', latitude: 43.6532, longitude: -79.3832, timezone: 'America/Toronto' },
];

const STEPS = ['Birth Date & Time', 'Birth Place', 'Profile & Relationship'];

export const CreateBirthProfileWizard: React.FC<CreateBirthProfileWizardProps> = ({
  open,
  onClose,
  onSave,
  initialProfile,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  // Step 1: Date & Time state
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [isTimeUnknown, setIsTimeUnknown] = useState(false);

  // Step 2: Location state
  const [selectedLocation, setSelectedLocation] = useState<BirthLocation | null>(null);
  const [customPlace, setCustomPlace] = useState('');
  const [customCountry, setCustomCountry] = useState('');
  const [useCustomLocation, setUseCustomLocation] = useState(false);

  // Step 3: Identity & Relationship
  const [profileName, setProfileName] = useState('');
  const [relationship, setRelationship] = useState<ProfileRelationship>('Myself');

  // Validation errors
  const [validationError, setValidationError] = useState<string | null>(null);

  // Populate if editing
  useEffect(() => {
    if (initialProfile) {
      setBirthDate(initialProfile.birthDate);
      setIsTimeUnknown(initialProfile.isTimeUnknown);
      // Strictly maintain null vs time
      setBirthTime(initialProfile.birthTime || '');
      setProfileName(initialProfile.name);
      setRelationship(initialProfile.relationship);

      const found = POPULAR_LOCATIONS.find(
        (loc) => loc.placeName.toLowerCase() === initialProfile.birthPlace.toLowerCase()
      );
      if (found) {
        setSelectedLocation(found);
        setUseCustomLocation(false);
      } else {
        setUseCustomLocation(true);
        setCustomPlace(initialProfile.birthPlace);
        setCustomCountry(initialProfile.country);
      }
    } else {
      // Default reset to empty clean fields
      setBirthDate('');
      setBirthTime('');
      setIsTimeUnknown(false);
      setSelectedLocation(null);
      setCustomPlace('');
      setCustomCountry('');
      setUseCustomLocation(false);
      setProfileName('');
      setRelationship('Myself');
    }
    setActiveStep(0);
    setValidationError(null);
  }, [initialProfile, open]);

  const handleNext = () => {
    setValidationError(null);

    if (activeStep === 0) {
      if (!birthDate) {
        setValidationError('Please specify a valid birth date.');
        return;
      }
      if (!isTimeUnknown && !birthTime) {
        setValidationError('Please enter a birth time or check "I don\'t know my birth time".');
        return;
      }
      setActiveStep(1);
    } else if (activeStep === 1) {
      if (useCustomLocation && (!customPlace.trim() || !customCountry.trim())) {
        setValidationError('Please provide both city/place name and country.');
        return;
      }
      if (!useCustomLocation && !selectedLocation) {
        setValidationError('Please select a birth place from the list.');
        return;
      }
      setActiveStep(2);
    }
  };

  const handleBack = () => {
    setValidationError(null);
    setActiveStep((prev) => Math.max(0, prev - 1));
  };

  const handleSave = () => {
    if (!profileName.trim()) {
      setValidationError('Please enter a name for this profile.');
      return;
    }

    const location: BirthLocation = useCustomLocation
      ? {
          placeName: customPlace.trim(),
          country: customCountry.trim(),
          latitude: 0,
          longitude: 0,
          timezone: 'UTC',
        }
      : selectedLocation || POPULAR_LOCATIONS[0];

    const dto: CreateBirthProfileDto = {
      name: profileName.trim(),
      relationship,
      birthDate,
      // CRITICAL RULE: Unknown time MUST be null, never 00:00!
      birthTime: isTimeUnknown ? null : birthTime,
      isTimeUnknown,
      birthPlace: location.placeName,
      country: location.country,
      latitude: location.latitude,
      longitude: location.longitude,
      timezone: location.timezone,
    };

    onSave(dto, initialProfile?.id);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="birth-profile-dialog-title"
    >
      <DialogTitle
        id="birth-profile-dialog-title"
        component="div"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #1E2638',
          py: 2,
          px: 3,
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontFamily: '"Cinzel", serif', fontWeight: 600, color: '#EDF1F7' }}>
          {initialProfile ? 'Edit Birth Profile' : 'Create Birth Profile'}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: '#94A3B8' }} aria-label="Close dialog">
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3, px: 3 }}>
        {/* M3 Stepper Progress */}
        <Box sx={{ mb: 3.5, mt: 1 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {STEPS.map((label, index) => (
              <Step key={label} completed={activeStep > index}>
                <StepLabel
                  slotProps={{
                    stepIcon: {
                      sx: {
                        '&.Mui-active': { color: '#E0C99A' },
                        '&.Mui-completed': { color: '#34D399' },
                      },
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.75rem',
                      fontWeight: activeStep === index ? 600 : 400,
                      color: activeStep === index ? '#E0C99A' : '#94A3B8',
                    }}
                  >
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {validationError && (
          <Alert severity="error" sx={{ mb: 2.5, backgroundColor: '#2B1214', color: '#FCA5A5', border: '1px solid #5C1D24' }}>
            {validationError}
          </Alert>
        )}

        {/* STEP 1: BIRTH DATE & TIME */}
        {activeStep === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Calendar size={16} /> Date of Birth
              </Typography>
              <TextField
                fullWidth
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
                helperText="Day, month, and year of solar entry"
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Clock size={16} /> Time of Birth
              </Typography>
              <TextField
                fullWidth
                type="time"
                value={isTimeUnknown ? '' : birthTime}
                disabled={isTimeUnknown}
                onChange={(e) => setBirthTime(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
                placeholder={isTimeUnknown ? 'Birth time unknown' : undefined}
                helperText={
                  isTimeUnknown
                    ? 'Time is marked as unknown. House cusps & Ascendant will adjust accordingly.'
                    : 'Exact 24-hour military format (HH:MM)'
                }
              />
            </Box>

            {/* Explicit unknown birth time checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={isTimeUnknown}
                  onChange={(e) => {
                    setIsTimeUnknown(e.target.checked);
                    if (e.target.checked) {
                      // Keep time strictly null in domain state
                    }
                  }}
                  sx={{ color: '#E0C99A', '&.Mui-checked': { color: '#E0C99A' } }}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: 600, color: isTimeUnknown ? '#E0C99A' : '#EDF1F7' }}>
                  I don't know my birth time
                </Typography>
              }
            />
          </Box>
        )}

        {/* STEP 2: BIRTH PLACE */}
        {activeStep === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MapPin size={16} /> Location Coordinates &amp; Timezone
            </Typography>

            {!useCustomLocation ? (
              <Box>
                <Autocomplete
                  options={POPULAR_LOCATIONS}
                  getOptionLabel={(option) => `${option.placeName}, ${option.country}`}
                  value={selectedLocation}
                  onChange={(_, val) => setSelectedLocation(val)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search or select birth city"
                      placeholder="Type city name..."
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props} key={option.placeName}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {option.placeName}, {option.country}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                          Lat: {option.latitude.toFixed(2)}°, Lon: {option.longitude.toFixed(2)}° · {option.timezone}
                        </Typography>
                      </Box>
                    </li>
                  )}
                />
                <Button
                  size="small"
                  onClick={() => setUseCustomLocation(true)}
                  sx={{ mt: 1.5, color: '#94A3B8', textDecoration: 'underline', fontSize: '0.75rem' }}
                >
                  Can't find your city? Enter custom location
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="City / Town"
                  value={customPlace}
                  onChange={(e) => setCustomPlace(e.target.value)}
                  placeholder="e.g. Kyoto"
                />
                <TextField
                  fullWidth
                  label="Country"
                  value={customCountry}
                  onChange={(e) => setCustomCountry(e.target.value)}
                  placeholder="e.g. Japan"
                />
                <Button
                  size="small"
                  onClick={() => setUseCustomLocation(false)}
                  sx={{ alignSelf: 'flex-start', color: '#E0C99A', fontSize: '0.75rem' }}
                >
                  ← Back to curated location list
                </Button>
              </Box>
            )}

            {selectedLocation && !useCustomLocation && (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: '#0E1322',
                  border: '1px solid #1E283D',
                }}
              >
                <Typography variant="caption" sx={{ color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Confirmed Geographic Anchor
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#EDF1F7', mt: 0.5 }}>
                  {selectedLocation.placeName}, {selectedLocation.country}
                </Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                  Coordinates: {selectedLocation.latitude.toFixed(4)}° N, {selectedLocation.longitude.toFixed(4)}° E · {selectedLocation.timezone}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* STEP 3: NAME & WHO IS THIS FOR? */}
        {activeStep === 2 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <User size={16} /> Profile Name
              </Typography>
              <TextField
                fullWidth
                label="Full or Preferred Name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="e.g. Bayu, Elena Vance"
                helperText="Used for chart labeling and Numerological acoustic vibration"
              />
            </Box>

            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ color: '#94A3B8', fontSize: '0.8125rem', mb: 1 }}>
                Who is this birth profile for?
              </FormLabel>
              <RadioGroup
                row
                value={relationship}
                onChange={(e) => setRelationship(e.target.value as ProfileRelationship)}
                sx={{ gap: 1 }}
              >
                {(['Myself', 'Someone Else', 'Family', 'Partner', 'Friend', 'Other'] as ProfileRelationship[]).map((rel) => (
                  <Box
                    key={rel}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
                      backgroundColor: relationship === rel ? 'rgba(224, 201, 154, 0.1)' : '#0E1322',
                      border: relationship === rel ? '1px solid #E0C99A' : '1px solid #1E283D',
                    }}
                  >
                    <FormControlLabel
                      value={rel}
                      control={<Radio size="small" sx={{ color: '#E0C99A', '&.Mui-checked': { color: '#E0C99A' } }} />}
                      label={<Typography variant="body2">{rel}</Typography>}
                    />
                  </Box>
                ))}
              </RadioGroup>
            </FormControl>

            {/* Summary Review Card */}
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: '#0E1322',
                border: '1px solid #1E283D',
              }}
            >
              <Typography variant="caption" sx={{ color: '#E0C99A', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                Data Integrity Confirmation
              </Typography>
              <Box sx={{ mt: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#94A3B8' }}>Birth Date</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{birthDate}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#94A3B8' }}>Birth Time</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: isTimeUnknown ? '#FBBF24' : '#EDF1F7' }}>
                    {isTimeUnknown ? 'Explicitly Unknown (null)' : birthTime}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #1E2638', justifyContent: 'space-between' }}>
        <Button onClick={onClose} sx={{ color: '#94A3B8' }}>
          Cancel
        </Button>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {activeStep > 0 && (
            <Button onClick={handleBack} variant="outlined" sx={{ borderColor: '#2E3952', color: '#94A3B8' }}>
              Back
            </Button>
          )}
          {activeStep < STEPS.length - 1 ? (
            <Button onClick={handleNext} variant="contained" color="primary">
              Next
            </Button>
          ) : (
            <Button onClick={handleSave} variant="contained" color="primary">
              Save Profile
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};
