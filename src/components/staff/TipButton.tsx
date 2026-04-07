"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Props for the `TipButton` component.
 */
export type TipButtonProps = {
  /**
   * Staff profile id used to call the tip API.
   */
  staffId: string;
};

type SubmitState = "idle" | "submitting" | "success" | "error";

const TIP_PRESETS_USD = [1, 2, 5, 10, 20] as const;

/**
 * Tip button that opens a modal/dialog to record a staff tip.
 *
 * When logged out, shows "Login to tip".
 *
 * @param props - Component props.
 * @param props.staffId - Staff profile id used for tip submissions.
 * @returns Tip button UI.
 */
export default function TipButton({ staffId }: TipButtonProps) {
  const { status } = useSession();

  const isAuthenticated = status === "authenticated";

  const [open, setOpen] = useState(false);
  const [amountInput, setAmountInput] = useState<string>("5");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(5);
  const [messageInput, setMessageInput] = useState<string>("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [feedback, setFeedback] = useState<string | null>(null);

  const isSubmitting = submitState === "submitting";

  const amountNumber = useMemo(() => {
    const parsed = Number.parseFloat(amountInput);
    return Number.isFinite(parsed) ? parsed : null;
  }, [amountInput]);

  const close = () => {
    setOpen(false);
  };

  const openDialog = () => {
    setFeedback(null);
    setSubmitState("idle");
    setOpen(true);
  };

  const selectPreset = (amount: number) => {
    setSelectedPreset(amount);
    setAmountInput(String(amount));
  };

  const submitTip = async () => {
    if (!isAuthenticated) return;

    setFeedback(null);

    if (amountNumber === null) {
      setSubmitState("error");
      setFeedback("Enter a valid amount.");
      return;
    }

    if (amountNumber < 1 || amountNumber > 100) {
      setSubmitState("error");
      setFeedback("Tip amount must be between $1 and $100.");
      return;
    }

    setSubmitState("submitting");

    try {
      const response = await fetch(`/api/staff/${staffId}/tip`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountNumber,
          message: messageInput.trim() ? messageInput.trim() : undefined,
        }),
      });

      if (!response.ok) {
        setSubmitState("error");
        setFeedback("Unable to send tip. Please try again.");
        return;
      }

      const json = (await response.json()) as unknown;
      if (
        typeof json !== "object" ||
        json === null ||
        !("tipId" in json) ||
        typeof (json as { tipId: unknown }).tipId !== "string"
      ) {
        setSubmitState("error");
        setFeedback("Unable to send tip. Please try again.");
        return;
      }

      setSubmitState("success");
      setFeedback("Tip sent. Thank you!");
      close();
    } catch {
      setSubmitState("error");
      setFeedback("Unable to send tip. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return <p className="mt-2 text-sm text-muted-foreground">Login to tip</p>;
  }

  return (
    <div className="mt-2">
      <Button type="button" variant="secondary" onClick={openDialog}>
        Tip
      </Button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Send a tip"
        >
          <div className="absolute inset-0 bg-background/80" />

          <Card className="relative w-full max-w-md">
            <CardContent className="pt-6">
              <h3 className="text-base font-semibold">Send a tip</h3>

              <div className="mt-5 space-y-4">
                <div>
                  <Label>Tip amount (USD)</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {TIP_PRESETS_USD.map((amount) => (
                      <Button
                        key={amount}
                        type="button"
                        variant={
                          selectedPreset === amount ? "default" : "outline"
                        }
                        size="sm"
                        disabled={isSubmitting}
                        onClick={() => selectPreset(amount)}
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>

                  <div className="mt-3">
                    <Label htmlFor="tip-amount">Custom amount</Label>
                    <Input
                      id="tip-amount"
                      type="number"
                      inputMode="decimal"
                      min={1}
                      max={100}
                      step={0.01}
                      value={amountInput}
                      disabled={isSubmitting}
                      onChange={(e) => {
                        setSelectedPreset(null);
                        setAmountInput(e.target.value);
                      }}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="tip-message">Message (optional)</Label>
                  <Input
                    id="tip-message"
                    value={messageInput}
                    disabled={isSubmitting}
                    placeholder="Thanks for the great service"
                    onChange={(e) => setMessageInput(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    onClick={close}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => void submitTip()}
                  >
                    {isSubmitting ? "Sending..." : "Send tip"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {feedback ? (
        <p
          className={
            submitState === "error"
              ? "mt-2 text-sm text-destructive"
              : "mt-2 text-sm text-muted-foreground"
          }
          role={submitState === "error" ? "alert" : "status"}
        >
          {feedback}
        </p>
      ) : null}
    </div>
  );
}
