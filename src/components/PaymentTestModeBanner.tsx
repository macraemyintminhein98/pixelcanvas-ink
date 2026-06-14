const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN;

export function PaymentTestModeBanner() {
  if (!clientToken?.startsWith("pk_test_")) return null;
  return (
    <div className="w-full bg-zap brut-border border-x-0 border-t-0 px-4 py-1.5 text-center text-xs font-bold uppercase tracking-wide text-ink">
      Test mode · use card 4242 4242 4242 4242 · any future expiry · any CVC
    </div>
  );
}
