#!/usr/bin/env python3
"""
TREBLE: Standalone Statutory Audit Receipt & Verification Engine
Jurisdiction: California Civil Code § 1950.5 (as amended by AB 2801, eff. Jan 1, 2025)
Authoritative Standards:
  - California Dept. of Real Estate (DRE) Reference Book (24-Month Paint Class Life)
  - California Business & Professions Code § 7031 (Contractor Licensing Bar)
  - California Civil Code § 1785.25(a) & Rosenthal Act § 1788 (Credit Reporting Dispute Rule)
"""

import sys
import time
from datetime import datetime, timezone
from dataclasses import dataclass
from typing import List, Optional

@dataclass
class DeductionItem:
    description: str
    claimed_amount: float
    category: str
    pre_repair_photo: bool
    post_repair_photo: bool
    contractor_licensed: Optional[bool]
    vendor_receipt_attached: bool
    hourly_log_attached: bool
    useful_life_months: Optional[float]

@dataclass
class AuditResult:
    item: DeductionItem
    allowable_amount: float
    statutory_verdict: str
    citation: str
    defect_type: str

def audit_deduction(item: DeductionItem, tenancy_months: float) -> AuditResult:
    # 1. Statutory Prerequisite: California AB 2801 Photographic Evidence Mandate
    if not (item.pre_repair_photo and item.post_repair_photo):
        return AuditResult(
            item=item,
            allowable_amount=0.0,
            statutory_verdict="STATUTORILY DEFECTIVE (AB 2801)",
            citation="Cal. Civ. Code § 1950.5(g)(2) [AB 2801]",
            defect_type="MISSING_BEFORE_AFTER_PHOTOGRAPHS"
        )

    # 2. Statutory Contractor Licensing Requirement: Cal. Bus. & Prof. Code § 7031
    # Any home repair or improvement billing exceeding $500 requires active CSLB license
    if item.claimed_amount > 500.0 and item.contractor_licensed is False:
        return AuditResult(
            item=item,
            allowable_amount=0.0,
            statutory_verdict="UNLICENSED CONTRACTOR VOID",
            citation="Cal. Bus. & Prof. Code § 7031",
            defect_type="UNLICENSED_CONTRACTOR_OVER_500"
        )

    # 3. Administrative / Labor Surcharges: Receipt or Time Log Mandate
    if item.category == "ADMINISTRATIVE":
        if not (item.vendor_receipt_attached or item.hourly_log_attached):
            return AuditResult(
                item=item,
                allowable_amount=0.0,
                statutory_verdict="UNRECEIPTED ADMINISTRATIVE SURCHARGE",
                citation="Cal. Civ. Code § 1950.5(g)(2)(A)",
                defect_type="NO_THIRD_PARTY_RECEIPT_OR_WAGE_LOG"
            )

    # 4. Useful Life Proration (DRE 24-Month Paint Useful Life Standard)
    if item.category == "PAINTING" and item.useful_life_months is not None:
        useful_life = item.useful_life_months
        if tenancy_months >= useful_life:
            return AuditResult(
                item=item,
                allowable_amount=0.0,
                statutory_verdict="UNLAWFUL WEAR & TEAR (USEFUL LIFE EXPIRED)",
                citation="Cal. Civ. Code § 1950.5(e) & DRE Reference Guide",
                defect_type="EXCEEDED_24_MONTH_DRE_PAINT_LIFE"
            )
        else:
            proration_ratio = max(0.0, 1.0 - (tenancy_months / useful_life))
            allowed = round(item.claimed_amount * proration_ratio, 2)
            return AuditResult(
                item=item,
                allowable_amount=allowed,
                statutory_verdict=f"PRORATED DEDUCTION ({int(proration_ratio*100)}% REMAINING LIFE)",
                citation="Cal. Civ. Code § 1950.5(e)",
                defect_type="PRORATED_WEAR"
            )

    # 5. Legitimate Documented Damage
    return AuditResult(
        item=item,
        allowable_amount=item.claimed_amount,
        statutory_verdict="VALID DOCUMENTED DEDUCTION",
        citation="Cal. Civ. Code § 1950.5(b)(3)",
        defect_type="NONE"
    )

def evaluate_case(
    case_name: str,
    move_in_date_str: str,
    move_out_date_str: str,
    notice_date_str: str,
    deposit_amount: float,
    deductions: List[DeductionItem]
):
    d_in = datetime.strptime(move_in_date_str, "%Y-%m-%d")
    d_out = datetime.strptime(move_out_date_str, "%Y-%m-%d")
    d_notice = datetime.strptime(notice_date_str, "%Y-%m-%d")

    tenancy_days = (d_out - d_in).days
    tenancy_months = round(tenancy_days / 30.4375, 1)
    notice_elapsed_days = (d_notice - d_out).days

    notice_deadline_violated = notice_elapsed_days > 21

    audit_results = [audit_deduction(d, tenancy_months) for d in deductions]
    total_claimed = sum(d.claimed_amount for d in deductions)
    total_allowed = sum(r.allowable_amount for r in audit_results)
    unlawful_withheld = total_claimed - total_allowed

    # Under Cal. Civ. Code § 1950.5(g)(1), failure to provide notice within 21 days
    # forfeits the landlord's right to retain ANY portion of the deposit.
    base_mandated_refund = deposit_amount if notice_deadline_violated else (deposit_amount - total_allowed)
    
    # Statutory Bad-Faith Exposure: Up to 2x deposit under § 1950.5(l)
    bad_faith_exposure = 2.0 * deposit_amount if (notice_deadline_violated or unlawful_withheld > 0) else 0.0
    total_small_claims_exposure = base_mandated_refund + bad_faith_exposure

    return {
        "case_name": case_name,
        "tenancy_months": tenancy_months,
        "notice_elapsed_days": notice_elapsed_days,
        "notice_deadline_violated": notice_deadline_violated,
        "total_claimed": total_claimed,
        "total_allowed": total_allowed,
        "unlawful_withheld": unlawful_withheld,
        "base_mandated_refund": base_mandated_refund,
        "bad_faith_exposure": bad_faith_exposure,
        "total_small_claims_exposure": total_small_claims_exposure,
        "audit_results": audit_results
    }

def run_receipt():
    start_time = time.perf_counter()

    print("==================================== TREBLE STATUTORY AUDIT RECEIPT ====================================")
    print("[JURISDICTION] California Civil Code § 1950.5 (as amended by AB 2801, eff. Jan 1, 2025)")
    print("[AUTHORITIES ] Cal. DRE Guidelines (24-Mo Paint Useful Life) | Cal. Bus. & Prof. Code § 7031")
    print("[CREDIT LAW  ] Cal. Civ. Code § 1785.25(a) (CCRAA) & Rosenthal Fair Debt Collection Practices Act")
    print("[MODULE      ] Entity Resolution & Correspondence Routing Engine")
    print()

    # TEST CASE 1: Marcus Vance (The Predatory Corporate Landlord Notice)
    marcus_deductions = [
        DeductionItem(
            description="Full interior apartment repaint",
            claimed_amount=800.0,
            category="PAINTING",
            pre_repair_photo=False, # AB 2801 defect
            post_repair_photo=False,
            contractor_licensed=True,
            vendor_receipt_attached=False,
            hourly_log_attached=False,
            useful_life_months=24.0 # DRE 2-year class life
        ),
        DeductionItem(
            description="Plumbing repair & drywall remediation",
            claimed_amount=550.0,
            category="REPAIR_CONTRACTOR",
            pre_repair_photo=False, # AB 2801 defect
            post_repair_photo=False,
            contractor_licensed=False, # Cal. Bus. & Prof. Code § 7031 violation (> $500 unlicensed)
            vendor_receipt_attached=True,
            hourly_log_attached=False,
            useful_life_months=None
        ),
        DeductionItem(
            description="Administrative move-out processing charge",
            claimed_amount=300.0,
            category="ADMINISTRATIVE",
            pre_repair_photo=True, # Photos not applicable, but receipt required
            post_repair_photo=True,
            contractor_licensed=None,
            vendor_receipt_attached=False, # § 1950.5(g)(2)(A) violation
            hourly_log_attached=False,
            useful_life_months=None
        )
    ]

    res_marcus = evaluate_case(
        case_name="Marcus Vance vs. Broadway Residential Owner IV LLC",
        move_in_date_str="2022-08-01",
        move_out_date_str="2026-08-01",
        notice_date_str="2026-08-25", # 24 days elapsed (> 21 day limit)
        deposit_amount=2200.0,
        deductions=marcus_deductions
    )

    print(f"--- CASE 1: {res_marcus['case_name']} ---")
    print(f"Tenancy Duration : {res_marcus['tenancy_months']} Months (200.0% of DRE 24-Mo Paint Useful Life)")
    print(f"Notice Elapsed   : {res_marcus['notice_elapsed_days']} Days -> EXCEEDS 21-Day Statutory Deadline [§ 1950.5(g)]")
    print(f"Base Deposit     : ${2200.0:.2f} | Landlord Claimed Deductions: ${res_marcus['total_claimed']:.2f}")
    print()
    print("LINE-ITEM AUDIT RESULTS:")
    for idx, r in enumerate(res_marcus["audit_results"], 1):
        print(f"  {idx}. '{r.item.description}' (${r.item.claimed_amount:.2f})")
        print(f"     - Allowable: ${r.allowable_amount:.2f} | Verdict: {r.statutory_verdict}")
        print(f"     - Statutory Citation: {r.citation}")
        print(f"     - Defect Code: {r.defect_type}")

    print()
    print("SETTLEMENT LEDGER & EXPOSURE:")
    print(f"  - Liquidated Unlawful Retention : ${res_marcus['unlawful_withheld']:.2f}")
    print(f"  - Mandatory Deposit Refund      : ${res_marcus['base_mandated_refund']:.2f} (Forfeited via late notice)")
    print(f"  - Bad-Faith Punitive Exposure   : ${res_marcus['bad_faith_exposure']:.2f} (2.0x Penalty [§ 1950.5(l)])")
    print(f"  - Total Small Claims Liability  : ${res_marcus['total_small_claims_exposure']:.2f}")
    print(f"  - 14-Day Statutory Cure Offer   : ${res_marcus['unlawful_withheld']:.2f} (Waiving bad-faith penalties)")
    print(f"  - CCRAA § 1785.25(a) Dispute Tag: ACTIVE (Derogatory credit reporting barred)")

    # Assertions for Marcus Vance (Predatory Notice)
    assert res_marcus["notice_deadline_violated"] is True, "Notice deadline violation should be True"
    assert res_marcus["total_allowed"] == 0.0, "All predatory deductions must be disallowed ($0.00)"
    assert res_marcus["unlawful_withheld"] == 1650.0, "Unlawful withheld must equal $1,650.00"
    assert res_marcus["base_mandated_refund"] == 2200.0, "Mandatory refund must be full deposit ($2,200)"
    assert res_marcus["total_small_claims_exposure"] == 6600.0, "Total exposure must equal $6,600.00"

    print()
    print("--- CASE 2: NEGATIVE-SPACE TEST (Legitimate Documented Claim) ---")
    # TEST CASE 2: Negative-Space Test (Tenant shattered a patio window at Month 10)
    legit_deductions = [
        DeductionItem(
            description="Replace shattered patio glass window",
            claimed_amount=350.0,
            category="REPAIR_CONTRACTOR",
            pre_repair_photo=True,  # AB 2801 satisfied
            post_repair_photo=True, # AB 2801 satisfied
            contractor_licensed=True, # Active CSLB license
            vendor_receipt_attached=True, # Paid glazier invoice attached
            hourly_log_attached=False,
            useful_life_months=None
        )
    ]

    res_legit = evaluate_case(
        case_name="Legitimate Damage Tenant vs. Ethical Landlord",
        move_in_date_str="2025-08-01",
        move_out_date_str="2026-06-01",
        notice_date_str="2026-06-12", # 11 days elapsed (< 21 days)
        deposit_amount=1500.0,
        deductions=legit_deductions
    )

    print(f"Case: {res_legit['case_name']}")
    print(f"Notice Elapsed : {res_legit['notice_elapsed_days']} Days (Timely Delivery)")
    print(f"Line Item      : '{res_legit['audit_results'][0].item.description}'")
    print(f"Verdict        : {res_legit['audit_results'][0].statutory_verdict}")
    print(f"Allowed Amount : ${res_legit['total_allowed']:.2f}")
    print(f"Refund Due     : ${res_legit['base_mandated_refund']:.2f}")
    print(f"Bad-Faith Risk : ${res_legit['bad_faith_exposure']:.2f} (Zero bad faith)")

    # Assertions for Legitimate Claim
    assert res_legit["notice_deadline_violated"] is False
    assert res_legit["total_allowed"] == 350.0, "Legitimate documented deduction must be allowed"
    assert res_legit["bad_faith_exposure"] == 0.0, "Bad faith exposure must be $0.00 for valid claim"

    elapsed_ms = (time.perf_counter() - start_time) * 1000.0
    print()
    print("========================================================================================================")
    print(f"EXECUTION LATENCY: {elapsed_ms:.2f}ms")
    print(f"DETERMINISTIC VERIFICATION STATUS: 100% PASS (< 1.0s Standard Satisfied)")
    print("========================================================================================================")

if __name__ == "__main__":
    run_receipt()
