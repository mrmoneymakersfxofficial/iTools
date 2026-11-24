"use client";

export interface PaymentMethodItem {
  name: string;
  isActive?: boolean;
  icon?: { asset?: { url?: string } };
}

export const DEFAULT_PAYMENT_METHODS: PaymentMethodItem[] = [
  { name: "Yape", isActive: true },
  { name: "Plin", isActive: true },
  { name: "Visa", isActive: true },
  { name: "Mastercard", isActive: true },
  { name: "Amex", isActive: true },
  { name: "Diners Club", isActive: true },
];

export function PaymentBadge({ method }: { method: PaymentMethodItem }) {
  if (method.icon?.asset?.url) {
    return (
      <img
        src={method.icon.asset.url}
        alt={method.name}
        title={method.name}
        className="h-5 sm:h-6 w-auto max-w-[64px] object-contain"
      />
    );
  }

  const key = (method.name || "").toLowerCase();

  if (key.includes("yape")) {
    return (
      <svg viewBox="0 0 42 22" className="h-5 sm:h-5.5 w-auto" fill="none" aria-label="Yape">
        <rect width="42" height="22" rx="4" fill="#742284" />
        <text x="21" y="15" fill="white" fontSize="12" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
          yape
        </text>
      </svg>
    );
  }

  if (key.includes("plin")) {
    return (
      <svg viewBox="0 0 38 22" className="h-5 sm:h-5.5 w-auto" fill="none" aria-label="Plin">
        <rect width="38" height="22" rx="4" fill="#00D1D5" />
        <text x="19" y="15" fill="white" fontSize="12" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
          plin
        </text>
      </svg>
    );
  }

  if (key.includes("visa")) {
    return (
      <svg viewBox="0 0 50 16" className="h-3.5 sm:h-4 w-auto" aria-label="Visa">
        <path
          d="M19.3 1.2L13.1 15.6H9.1L5.6 3.6C5.4 2.8 5.2 2.5 4.6 2.2C3.5 1.6 1.7 1.1 0 0.8L0.1 0.4H7.2C8.1 0.4 8.9 1 9.1 2.1L10.8 11.2L15.3 0.4H19.3ZM36.1 10.7C36.1 6.6 30.4 6.4 30.5 4.6C30.5 4 31 3.4 32.2 3.3C32.8 3.2 34.4 3.1 36.2 4L36.9 0.7C35.9 0.3 34.6 0 33 0C28.9 0 26.1 2.2 26 5.3C25.9 7.6 28 8.9 29.5 9.7C31.1 10.5 31.7 11 31.7 11.7C31.7 12.8 30.4 13.3 29.2 13.3C27.1 13.3 25.9 13 24.6 12.4L23.9 15.8C25.1 16.3 27 16.7 28.9 16.7C33.3 16.7 36.1 14.5 36.1 10.7ZM46.7 15.6H50.2L47.1 0.4H43.9C43.1 0.4 42.5 0.9 42.2 1.6L36 15.6H40.2L41 13.3H46L46.7 15.6ZM42.1 10.3L44.2 4.4L45.4 10.3H42.1ZM25.3 0.4L22.2 15.6H18.4L21.5 0.4H25.3Z"
          fill="#1434CB"
        />
      </svg>
    );
  }

  if (key.includes("master")) {
    return (
      <svg viewBox="0 0 34 22" className="h-4.5 sm:h-5.5 w-auto" aria-label="Mastercard">
        <circle cx="11" cy="11" r="10" fill="#EB001B" />
        <circle cx="23" cy="11" r="10" fill="#F79E1B" />
        <path d="M17 4.1a10 10 0 0 1 0 13.8 10 10 0 0 1 0-13.8z" fill="#FF5F00" />
      </svg>
    );
  }

  if (key.includes("amex") || key.includes("american")) {
    return (
      <svg viewBox="0 0 28 22" className="h-4.5 sm:h-5.5 w-auto" aria-label="American Express">
        <rect width="28" height="22" rx="3" fill="#006FCF" />
        <text x="14" y="14.5" fill="white" fontSize="7" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="0.5">
          AMEX
        </text>
      </svg>
    );
  }

  if (key.includes("diner")) {
    return (
      <svg viewBox="0 0 54 22" className="h-4.5 sm:h-5.5 w-auto" aria-label="Diners Club">
        <rect width="54" height="22" rx="3" fill="#0079BE" />
        <circle cx="12" cy="11" r="7" fill="white" />
        <path d="M12 4.5a6.5 6.5 0 0 0 0 13V4.5z" fill="#0079BE" />
        <text x="33" y="10.5" fill="white" fontSize="5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
          Diners Club
        </text>
        <text x="33" y="16" fill="white" fontSize="3" fontWeight="normal" fontFamily="sans-serif" textAnchor="middle" letterSpacing="0.4">
          INTERNATIONAL
        </text>
      </svg>
    );
  }

  return (
    <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 text-[10px] font-bold uppercase tracking-wide border border-neutral-200">
      {method.name}
    </span>
  );
}
