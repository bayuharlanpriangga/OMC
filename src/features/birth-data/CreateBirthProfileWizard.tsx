import React, { useState, useEffect, useRef } from 'react';
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
  CircularProgress,
} from '@mui/material';
import { X, Calendar, MapPin, User, Clock, AlertTriangle } from 'lucide-react';
import tzlookup from 'tz-lookup';
import { BirthLocation, BirthProfile, CreateBirthProfileDto, ProfileRelationship } from '../../types/birth-data';

interface CreateBirthProfileWizardProps {
  open: boolean;
  onClose: () => void;
  onSave: (profileDto: CreateBirthProfileDto, editingId?: string) => void;
  initialProfile?: BirthProfile | null;
}

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

// Fallback used only if a save is somehow attempted with no location resolved.
const DEFAULT_LOCATION: BirthLocation = {
  placeName: 'Jakarta',
  country: 'Indonesia',
  latitude: -6.2088,
  longitude: 106.8456,
  timezone: 'Asia/Jakarta',
};

/**
 * Queries the Mapbox Geocoding API for cities/towns matching the given
 * text and resolves each result's IANA timezone offline via tz-lookup
 * (Mapbox does not return timezone directly).
 */
async function geocodeCities(query: string, signal: AbortSignal): Promise<BirthLocation[]> {
  if (!MAPBOX_TOKEN) return [];

  const url =
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json` +
    `?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=8&types=place,locality,region`;

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Mapbox geocoding failed: ${response.status}`);
  }
  const data = await response.json();

  const features: any[] = Array.isArray(data.features) ? data.features : [];

  return features.map((feature) => {
    const [longitude, latitude] = feature.center as [number, number];
    const countryContext = (feature.context || []).find((c: any) => typeof c.id === 'string' && c.id.startsWith('country'));
    const country = countryContext?.text || feature.place_name?.split(',').pop()?.trim() || '';

    let timezone = 'UTC';
    try {
      timezone = tzlookup(latitude, longitude);
    } catch {
      // Point falls outside all known timezone polygons (rare, e.g. open ocean) — keep UTC.
    }

    return {
      placeName: feature.text as string,
      country,
      latitude,
      longitude,
      timezone,
    } satisfies BirthLocation;
  });
}

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

  // Live city search (Mapbox Geocoding), replaces the old static shortlist
  const [cityInput, setCityInput] = useState('');
  const [cityOptions, setCityOptions] = useState<BirthLocation[]>([]);
  const [isSearchingCity, setIsSearchingCity] = useState(false);
  const [citySearchError, setCitySearchError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

      // Trust the profile's own stored coordinates/timezone directly —
      // no need to re-match against any curated list.
      const existingLocation: BirthLocation = {
        placeName: initialProfile.birthPlace,
        country: initialProfile.country,
        latitude: initialProfile.latitude,
        longitude: initialProfile.longitude,
        timezone: initialProfile.timezone,
      };
      setSelectedLocation(existingLocation);
      setCityOptions([existingLocation]);
      setCityInput(`${existingLocation.placeName}, ${existingLocation.country}`);
      setUseCustomLocation(false);
      setCustomPlace('');
      setCustomCountry('');
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
      setCityInput('');
      setCityOptions([]);
      setCitySearchError(null);
    }
    setActiveStep(0);
    setValidationError(null);
  }, [initialProfile, open]);

  // Debounced live city search against Mapbox Geocoding as the user types
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const query = cityInput.trim();

    // Don't re-search right after picking an option (input mirrors the pick)
    if (selectedLocation && query === `${selectedLocation.placeName}, ${selectedLocation.country}`) {
      return;
    }

    if (query.length < 2) {
      setCityOptions([]);
      setIsSearchingCity(false);
      setCitySearchError(null);
      return;
    }

    if (!MAPBOX_TOKEN) {
      setCitySearchError('Mapbox token is not configured (VITE_MAPBOX_TOKEN).');
      return;
    }

    debounceRef.current = setTimeout(() => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsSearchingCity(true);
      setCitySearchError(null);

      geocodeCities(query, controller.signal)
        .then((results) => {
          setCityOptions(results);
        })
        .catch((err) => {
          if (err?.name === 'AbortError') return;
          setCitySearchError('Could not reach city search. You can enter a custom location instead.');
        })
        .finally(() => {
          setIsSearchingCity(false);
        });
    }, 350);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityInput]);

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
      : selectedLocation || DEFAULT_LOCATION;

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
        <Box sx={{ mb: 3.5, mt: 2 }}>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{ '& .MuiStepLabel-labelContainer': { mt: 0.25 } }}
          >
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
                  options={cityOptions}
                  filterOptions={(opts) => opts}
                  getOptionLabel={(option) => `${option.placeName}, ${option.country}`}
                  isOptionEqualToValue={(opt, val) =>
                    opt.placeName === val.placeName &&
                    opt.country === val.country &&
                    opt.latitude === val.latitude &&
                    opt.longitude === val.longitude
                  }
                  value={selectedLocation}
                  inputValue={cityInput}
                  onInputChange={(_, val) => setCityInput(val)}
                  onChange={(_, val) => {
                    setSelectedLocation(val);
                    setCityInput(val ? `${val.placeName}, ${val.country}` : '');
                  }}
                  loading={isSearchingCity}
                  noOptionsText={
                    cityInput.trim().length < 2
                      ? 'Type at least 2 characters to search…'
                      : 'No cities found. Try a different spelling, or enter a custom location.'
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search or select birth city"
                      placeholder="Type city name..."
                      slotProps={{
                        ...params.slotProps,
                        input: {
                          ...params.slotProps.input,
                          endAdornment: (
                            <>
                              {isSearchingCity ? <CircularProgress color="inherit" size={16} /> : null}
                              {params.slotProps.input.endAdornment}
                            </>
                          ),
                        },
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props} key={`${option.placeName}-${option.latitude}-${option.longitude}`}>
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

                {citySearchError && (
                  <Alert severity="warning" sx={{ mt: 1.5 }}>
                    {citySearchError}
                  </Alert>
                )}

                {selectedLocation && (
                  <Box
                    sx={{
                      mt: 1.5,
                      p: 1.5,
                      borderRadius: 2,
                      border: '1px solid #34D399',
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#34D399' }}>
                      {selectedLocation.placeName}, {selectedLocation.country}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                      Coordinates: {selectedLocation.latitude.toFixed(4)}° N, {selectedLocation.longitude.toFixed(4)}° E · {selectedLocation.timezone}
                    </Typography>
                  </Box>
                )}

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
                  ← Back to city search
                </Button>
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
                sx={{
                  flexWrap: 'nowrap',
                  overflowX: 'auto',
                  gap: 2,
                  pb: 0.5,
                }}
              >
                {(['Myself', 'Someone Else', 'Family', 'Partner', 'Friend', 'Other'] as ProfileRelationship[]).map((rel) => (
                  <FormControlLabel
                    key={rel}
                    value={rel}
                    control={<Radio size="small" sx={{ color: '#E0C99A', '&.Mui-checked': { color: '#E0C99A' } }} />}
                    label={
                      <Typography
                        variant="body2"
                        sx={{
                          color: relationship === rel ? '#E0C99A' : '#EDF1F7',
                          fontWeight: relationship === rel ? 600 : 400,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {rel}
                      </Typography>
                    }
                    sx={{ flexShrink: 0, mr: 0 }}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            {/* Summary Review Card */}
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                border: '1px solid #E0C99A',
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
