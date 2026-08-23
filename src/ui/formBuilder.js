function buildInputForm(containerId, systemId) {
  const container = document.getElementById(containerId);
  if(!container) return;
  
  // Clone form elements
  container.innerHTML = `
    <div class="fstep on" id="fs1-${systemId}">
      <div class="fi">
        <label>Nama Lengkap</label>
        <input id="iName-${systemId}" type="text" placeholder="Tuliskan namamu" autocomplete="off">
      </div>
      <div class="fi">
        <label>Jenis Kelamin</label>
        <div class="custom-select" id="genderSelect-${systemId}">
          <div class="cs-display" onclick="toggleCS('genderSelect-${systemId}')">
            <span class="cs-val" id="genderVal-${systemId}">Pilih...</span>
            <span class="cs-arrow">↓</span>
          </div>
          <div class="cs-dropdown" id="genderSelect-${systemId}Dropdown">
            <div class="cs-opt" onclick="selectCS('genderSelect-${systemId}','genderVal-${systemId}','iGen-${systemId}','m','Pria')">Pria</div>
            <div class="cs-opt" onclick="selectCS('genderSelect-${systemId}','genderVal-${systemId}','iGen-${systemId}','f','Perempuan')">Perempuan</div>
          </div>
        </div>
        <input type="hidden" id="iGen-${systemId}">
      </div>
    </div>
    <div class="fi" style="margin-top:8px">
      <label>Tanggal Lahir</label>
      <div class="custom-date" id="datePicker-${systemId}">
        <div class="cd-display" onclick="toggleDatePickerSys('${systemId}')">
          <span class="cd-val" id="dateDisplay-${systemId}" style="color:var(--muted)">Pilih tanggal lahir</span>
          <span class="cs-arrow">✦</span>
        </div>
        <div class="cd-panel" id="datePanel-${systemId}">
          <div class="cd-panel-top">
            <button class="cd-nav" onclick="cdNavYearSys('${systemId}',-1)">‹</button>
            <div class="cd-selects">
              <div class="custom-select sm" id="monthSel-${systemId}">
                <div class="cs-display sm" onclick="toggleCS('monthSel-${systemId}')">
                  <span class="cs-val" id="monthVal-${systemId}">Jan</span><span class="cs-arrow">↓</span>
                </div>
                <div class="cs-dropdown" id="monthSel-${systemId}Dropdown"></div>
              </div>
              <div class="custom-select sm" id="yearSel-${systemId}">
                <div class="cs-display sm" onclick="toggleCS('yearSel-${systemId}')">
                  <span class="cs-val" id="yearVal-${systemId}">1995</span><span class="cs-arrow">↓</span>
                </div>
                <div class="cs-dropdown" id="yearSel-${systemId}Dropdown"></div>
              </div>
            </div>
            <button class="cd-nav" onclick="cdNavYearSys('${systemId}',1)">›</button>
          </div>
          <div class="cd-weekdays"><span>Min</span><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span></div>
          <div class="cd-grid" id="cdGrid-${systemId}"></div>
        </div>
      </div>
      <input type="hidden" id="iDate-${systemId}" value="">
    </div>
    <div class="fi">
      <label>Jam Lahir <span style="color:var(--muted);font-size:.85em">(opsional)</span></label>
      <div class="tw-wrap" id="twWrap-${systemId}">
        <div class="tw-field" onclick="toggleTWSys('${systemId}')">
          <span class="tw-icon">☽</span>
          <span id="twDisplay-${systemId}">07 : 30</span>
          <span class="tw-edit">ubah</span>
        </div>
        <div class="tw-panel" id="twPanel-${systemId}">
          <div class="tw-label-row"><span>JAM</span><span>MENIT</span></div>
          <div class="tw-drums">
            <div class="tw-drum" id="twHourDrum-${systemId}"><div class="tw-drum-inner" id="twHourInner-${systemId}"></div></div>
            <div class="tw-colon">:</div>
            <div class="tw-drum" id="twMinDrum-${systemId}"><div class="tw-drum-inner" id="twMinInner-${systemId}"></div></div>
          </div>
          <button class="tw-confirm" onclick="confirmTWSys('${systemId}')">Pilih waktu ini</button>
        </div>
      </div>
      <input type="hidden" id="iTime-${systemId}" value="07:30">
    </div>
    <div class="fi">
      <label>Kota Kelahiran <span style="color:var(--red);font-size:.9em">*wajib</span></label>
      <div class="city-wrap" id="cityWrap-${systemId}">
        <input id="iCity-${systemId}" type="text" placeholder="Ketik nama kota..." autocomplete="off"
          oninput="onCityInputSys('${systemId}')" onblur="onCityBlurSys('${systemId}')">
        <div class="city-dropdown" id="cityDropdown-${systemId}"></div>
      </div>
      <div class="city-status" id="cityStatus-${systemId}"></div>
      <input type="hidden" id="iCityLat-${systemId}">
      <input type="hidden" id="iCityLon-${systemId}">
      <input type="hidden" id="iCityTz-${systemId}">
      <input type="hidden" id="iCityConfirmed-${systemId}" value="0">
    </div>
    <div class="confhint" id="chint-${systemId}" style="display:none">
      <div class="cdot" id="cdot-${systemId}"></div>
      <div class="chint-text" id="ctxt-${systemId}"></div>
    </div>
    <button class="btn" style="margin-top:20px" onclick="runSysCalc('${systemId}')">
      <span>Generate ✦</span>
    </button>

    <!-- If already has data for other system, offer to use it -->
    <div id="use-existing-${systemId}" style="display:none;margin-top:14px;padding:12px 14px;background:var(--s2);border:1px solid var(--b1);border-radius:var(--r)">
      <div style="font-family:var(--font-mono);font-size:8px;letter-spacing:.2em;color:var(--gold);margin-bottom:6px">DATA TERSIMPAN</div>
      <div id="existing-name-${systemId}" style="font-size:12px;color:var(--dim);margin-bottom:8px"></div>
      <button onclick="useExistingData('${systemId}')" style="background:none;border:1px solid rgba(201,168,76,.4);color:var(--gold);font-family:var(--font-mono);font-size:8px;letter-spacing:.2em;padding:6px 12px;cursor:pointer;border-radius:var(--r)">Gunakan data ini →</button>
    </div>
  `;

  // Initialize date picker for this system
  initSysDatePicker(systemId);
  initSysTimePicker(systemId);

  // Show existing data option if available
  if(_globalD && _globalRaw) {
    const eu = document.getElementById('use-existing-'+systemId);
    const en = document.getElementById('existing-name-'+systemId);
    if(eu && en) {
      eu.style.display = 'block';
      en.textContent = `${_globalRaw.name} · ${_globalRaw.dateStr} · ${_globalRaw.city}`;
    }
  }
}

// ── SYSTEM-SPECIFIC PICKER ADAPTERS ──
const _sysPickerState = {};

