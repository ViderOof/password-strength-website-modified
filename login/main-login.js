main { padding: 60px 0 80px; }

    /* ── Hero ── */
    .contact-hero {
      text-align: center;
      max-width: 560px;
      margin: 0 auto 56px;
      animation: fadeUp 0.5s cubic-bezier(0.4,0,0.2,1) both;
    }
    .eyebrow {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      color: rgba(124,92,255,0.90);
      border: 1px solid rgba(124,92,255,0.30);
      background: rgba(124,92,255,0.08);
      padding: 4px 14px;
      border-radius: 999px;
      margin-bottom: 20px;
    }
    .contact-hero .h1 {
      font-size: clamp(26px, 4vw, 40px);
      font-weight: 800;
      letter-spacing: -0.8px;
      margin-bottom: 14px;
    }
    .contact-hero .p {
      font-size: 15px;
      color: rgba(255,255,255,0.55);
      line-height: 1.7;
    }

    /* ── Layout ── */
    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      align-items: start;
      animation: fadeUp 0.5s 0.1s cubic-bezier(0.4,0,0.2,1) both;
    }

    /* ── Form card ── */
    .form-card {
      background: rgba(255,255,255,0.055);
      border: 1px solid rgba(255,255,255,0.10);
      border-radius: 20px;
      padding: 32px;
      backdrop-filter: blur(8px);
    }
    .form-card h2 {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 22px;
      letter-spacing: -0.2px;
    }
    .field {
      margin-bottom: 4px;
    }
    .field label {
      display: block;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.7px;
      text-transform: uppercase;
      color: rgba(255,255,255,0.50);
      margin: 16px 0 7px;
    }
    .field input,
    .field textarea {
      width: 100%;
      padding: 12px 16px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.12);
      background: rgba(255,255,255,0.04);
      color: rgba(255,255,255,0.92);
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      outline: none;
      resize: vertical;
      transition: border-color 150ms ease, box-shadow 150ms ease;
    }
    .field input::placeholder,
    .field textarea::placeholder {
      color: rgba(255,255,255,0.25);
    }
    .field input:focus,
    .field textarea:focus {
      border-color: rgba(124,92,255,0.65);
      box-shadow: 0 0 0 3px rgba(124,92,255,0.14);
      background: rgba(255,255,255,0.055);
    }
    .field textarea {
      min-height: 120px;
      font-family: 'DM Sans', sans-serif;
    }
    .btn-send {
      width: 100%;
      margin-top: 20px;
      padding: 13px;
      border: none;
      border-radius: 12px;
      background: linear-gradient(135deg, #7c5cff 0%, #5a3de8 100%);
      color: #fff;
      font-family: 'DM Sans', sans-serif;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      letter-spacing: 0.2px;
      box-shadow: 0 4px 20px rgba(124,92,255,0.30);
      transition: transform 100ms ease, box-shadow 120ms ease;
    }
    .btn-send:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 28px rgba(124,92,255,0.45);
    }
    .btn-send:active { transform: translateY(0); }
    .btn-send:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
    #formMsg {
      text-align: center;
      font-size: 13px;
      margin-top: 12px;
      min-height: 18px;
    }

    /* ── Side cards ── */
    .side-cards {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .side-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 18px;
      padding: 24px;
      transition: border-color 150ms ease, transform 150ms ease;
    }
    .side-card:hover {
      border-color: rgba(255,255,255,0.15);
      transform: translateY(-2px);
    }
    .side-card h3 {
      font-size: 15px;
      font-weight: 700;
      margin-bottom: 14px;
      color: rgba(255,255,255,0.85);
    }

    /* social links */
    .social-links {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .social-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.03);
      color: rgba(255,255,255,0.75);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: background 120ms ease, border-color 120ms ease, color 120ms ease;
    }
    .social-link:hover {
      background: rgba(255,255,255,0.07);
      border-color: rgba(255,255,255,0.16);
      color: rgba(255,255,255,0.95);
    }
    .social-link .sicon {
      font-size: 18px;
      width: 24px;
      text-align: center;
      flex-shrink: 0;
    }
    .social-link .slabel {
      flex: 1;
    }
    .social-link .sarrow {
      font-size: 12px;
      color: rgba(255,255,255,0.30);
    }

    /* response time badge */
    .response-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: rgba(34,197,94,0.85);
      background: rgba(34,197,94,0.08);
      border: 1px solid rgba(34,197,94,0.25);
      padding: 5px 12px;
      border-radius: 999px;
      margin-top: 4px;
    }
    .response-badge::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: rgba(34,197,94,0.85);
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.4; }
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 768px) {
      .contact-grid { grid-template-columns: 1fr; }
    }
