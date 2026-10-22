import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';

export type BillingCycle = 'monthly' | 'yearly';

export interface CheckoutPlan {
    key: string;
    title: string;
    subtitle: string;
    monthlyPrice: number;
    yearlyPrice: number;
    badge: string | null;
    branchLimit: number;
    features: string[];
}

export interface SignupCheckoutPayload {
    planKey: string;
    billingCycle: BillingCycle;
    promoCode: string | null;

    tenant: {
        name: string;
        slug: string;
        culture: string;
        timezone: string;
        currency: string;
    };

    businessProfile: {
        displayName: string;
        activityType: string;
        phone: string | null;
        city: string;
        address: string;
        postalCode: string | null;
        instagram: string | null;
    };

    owner: {
        firstName: string;
        lastName: string;
        mobile: string;
        email: string;
        password: string;
    };

    branch: {
        name: string;
        phone: string;
        city: string;
        address: string;
    } | null;

    metadata: {
        source: string;
        locale: string;
    };
}

export interface SignupCheckoutResponse {
    checkoutId: string;
    paymentUrl: string;
    mode: 'mock' | 'gateway';
}

@Injectable({ providedIn: 'root' })
export class SignupCheckoutService {
    private readonly http = inject(HttpClient);

    // Keep true until backend endpoint is ready.
    private readonly useMock = true;

    startCheckout(payload: SignupCheckoutPayload): Observable<SignupCheckoutResponse> {
        if (this.useMock) {
            return of({
                checkoutId: crypto.randomUUID(),
                paymentUrl: '/mock-payment',
                mode: 'mock' as const
            }).pipe(delay(850));
        }

        // Suggested endpoint:
        // POST /api/public/signup/checkout
        return this.http.post<SignupCheckoutResponse>(
            '/api/public/signup/checkout',
            payload
        );
    }
}
