"use client";

import { useEffect } from "react";

type PolicyModalProps = {
  open: boolean;
  version?: string;
  title?: string;
  onClose: () => void;
  onAcknowledge?: () => void; 
};

export default function PolicyModal({
  open,
  version = "v1",
  title = "Privacy Policy / Terms",
  onClose,
  onAcknowledge,
}: PolicyModalProps) {
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close policy"
      />

      {/* Modal */}
      <div className="relative h-full w-full max-w-[420px] overflow-hidden rounded-3xl border border-white/12 bg-[#07162F]/95 shadow-[0_30px_80px_rgba(0,0,0,0.60)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div>
            <div className="text-sm font-extrabold text-white/90">{title}</div>
            <div className="text-[12px] text-white/55">Version: {version}</div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold text-white/80 hover:bg-white/10 active:scale-[0.99] transition"
          >
            ปิด
          </button>
        </div>

        {/* Body (scroll-y) */}
        <div className="max-h-[70vh] overflow-y-auto px-4 py-4 text-sm leading-relaxed text-white/75">
          <PolicyContent />
        </div>

        {/* Footer action */}
        <div className="border-t border-white/10 px-4 py-3">
          <button
            type="button"
            onClick={() => {
              onAcknowledge?.();
              onClose();
            }}
            className="w-full h-[48px] rounded-md font-extrabold tracking-wide
              flex items-center justify-center text-white
              bg-gradient-to-br from-sky-400 to-blue-600
              
              active:scale-[0.99] transition"
          >
            เข้าใจแล้ว
          </button>
        </div>
      </div>
    </div>
  );
}

function PolicyContent() {
  return (
    <div className="space-y-4">
      <p className="text-white/75">
        เอกสารนี้เป็นตัวอย่าง Privacy Policy และ Terms สำหรับ <b>Demo App</b>{" "}
        เท่านั้น เพื่อแสดง flow การยินยอมก่อนสมัครสมาชิก ในระบบจริงควรปรึกษาฝ่ายกฎหมาย/คอมพลายแอนซ์
        และปรับเนื้อหาให้สอดคล้องกับนโยบายขององค์กรและกฎหมายที่เกี่ยวข้อง (เช่น PDPA)
      </p>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h3 className="text-sm font-extrabold text-white/90">
          1) คำนิยาม
        </h3>
        <ul className="mt-2 list-disc pl-5 space-y-1 text-white/70">
          <li>
            “ผู้ควบคุมข้อมูล” หมายถึง ผู้ดำเนินการแอป/ผู้ให้บริการโปรแกรม Loyalty
          </li>
          <li>
            “ข้อมูลส่วนบุคคล” หมายถึง ข้อมูลที่สามารถระบุตัวตนได้ เช่น ชื่อ-นามสกุล อีเมล วันเกิด
          </li>
          <li>
            “ข้อมูลอ่อนไหว” (ถ้ามี) เช่น ข้อมูลศาสนา เลขเอกสารระบุตัวตน ฯลฯ
          </li>
        </ul>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h3 className="text-sm font-extrabold text-white/90">
          2) ข้อมูลที่เราเก็บรวบรวม
        </h3>
        <p className="mt-2 text-white/70">
          เพื่อให้บริการสมาชิกและสิทธิประโยชน์ของโปรแกรม Loyalty เราอาจเก็บข้อมูลดังต่อไปนี้:
        </p>
        <ul className="mt-2 list-disc pl-5 space-y-1 text-white/70">
          <li>ข้อมูลบัญชี: username, รหัสผ่าน (จัดเก็บเป็นรหัสผ่านที่ถูกแฮชเท่านั้น)</li>
          <li>ข้อมูลสมาชิก: ชื่อจริง, นามสกุล, อีเมล, วันเกิด</li>
          <li>ข้อมูลเพิ่มเติม (เลือกได้): สัญชาติ, ศาสนา</li>
          <li>
            ข้อมูลเอกสารยืนยันตัวตน (ตามความจำเป็น): เลขบัตรประชาชน หรือ Passport Number
          </li>
          <li>ข้อมูลการใช้งาน: เวลาการใช้งานบางส่วนเพื่อวิเคราะห์ประสบการณ์ผู้ใช้ (Demo)</li>
        </ul>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h3 className="text-sm font-extrabold text-white/90">
          3) วัตถุประสงค์และฐานการประมวลผล
        </h3>
        <ul className="mt-2 list-disc pl-5 space-y-2 text-white/70">
          <li>
            <b>สร้างและบริหารบัญชีสมาชิก</b> (การปฏิบัติตามสัญญา/การให้บริการ)
          </li>
          <li>
            <b>ยืนยันตัวตน</b> เพื่อความถูกต้องของสมาชิกและการให้สิทธิประโยชน์ (ประโยชน์โดยชอบด้วยกฎหมาย/ความปลอดภัย)
          </li>
          <li>
            <b>ให้สิทธิประโยชน์/คะแนน/สถานะสมาชิก</b> และติดตามการใช้งาน (การให้บริการ)
          </li>
          <li>
            <b>การสื่อสารเกี่ยวกับบัญชีและโปรแกรม</b> เช่น แจ้งเตือนสิทธิประโยชน์ (การให้บริการ)
          </li>
          <li>
            <b>การปรับปรุงคุณภาพบริการ</b> และวิเคราะห์ประสบการณ์ผู้ใช้ (ประโยชน์โดยชอบด้วยกฎหมาย)
          </li>
        </ul>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h3 className="text-sm font-extrabold text-white/90">
          4) การเปิดเผยข้อมูลและผู้ประมวลผลข้อมูล
        </h3>
        <p className="mt-2 text-white/70">
          เราอาจเปิดเผยข้อมูลให้แก่ผู้ให้บริการที่เกี่ยวข้องเพื่อดำเนินงานระบบ เช่น โครงสร้างพื้นฐาน Cloud,
          ผู้ให้บริการอีเมล/แจ้งเตือน หรือผู้ให้บริการฐานข้อมูล โดยจะมีมาตรการตามสัญญาเพื่อคุ้มครองข้อมูล
        </p>
        <p className="mt-2 text-white/70">
          เราจะไม่ขายข้อมูลส่วนบุคคลให้บุคคลภายนอก
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h3 className="text-sm font-extrabold text-white/90">
          5) ระยะเวลาการเก็บรักษาข้อมูล
        </h3>
        <p className="mt-2 text-white/70">
          เราจะเก็บข้อมูลเท่าที่จำเป็นตามวัตถุประสงค์ของการให้บริการ หรือเท่าที่กฎหมายกำหนด
          เมื่อพ้นระยะเวลาที่จำเป็น เราจะลบหรือทำให้ข้อมูลไม่สามารถระบุตัวตนได้ตามแนวทางที่เหมาะสม
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h3 className="text-sm font-extrabold text-white/90">
          6) มาตรการความปลอดภัย
        </h3>
        <ul className="mt-2 list-disc pl-5 space-y-1 text-white/70">
          <li>จัดเก็บรหัสผ่านแบบแฮช (ไม่เก็บเป็น plain text)</li>
          <li>จำกัดสิทธิ์การเข้าถึงข้อมูลเฉพาะผู้ที่จำเป็น</li>
          <li>บันทึกเหตุการณ์สำคัญในระบบเพื่อการตรวจสอบ (audit) ตามความเหมาะสม</li>
          <li>ใช้มาตรการด้านความปลอดภัยของโครงสร้างพื้นฐานเพื่อป้องกันการเข้าถึงโดยไม่ได้รับอนุญาต</li>
        </ul>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h3 className="text-sm font-extrabold text-white/90">
          7) สิทธิของเจ้าของข้อมูล
        </h3>
        <p className="mt-2 text-white/70">
          คุณอาจมีสิทธิตามกฎหมาย เช่น ขอเข้าถึง ขอแก้ไข ขอให้ลบข้อมูล คัดค้านการประมวลผล
          หรือถอนความยินยอม (ในกรณีที่ฐานการประมวลผลเป็นความยินยอม) ทั้งนี้ขึ้นกับเงื่อนไขตามกฎหมาย
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h3 className="text-sm font-extrabold text-white/90">
          8) การยินยอมและการถอนความยินยอม
        </h3>
        <p className="mt-2 text-white/70">
          เมื่อคุณติ๊ก “ยินยอม” หมายถึงคุณรับทราบและยอมรับเงื่อนไขตามเอกสารนี้
          คุณสามารถถอนความยินยอมได้ภายใต้เงื่อนไขของการให้บริการและข้อกำหนดทางกฎหมาย
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h3 className="text-sm font-extrabold text-white/90">
          9) เงื่อนไขการใช้งาน (Terms)
        </h3>
        <ul className="mt-2 list-disc pl-5 space-y-1 text-white/70">
          <li>ผู้ใช้งานต้องให้ข้อมูลที่ถูกต้องและเป็นปัจจุบัน</li>
          <li>ห้ามใช้ระบบในทางที่ผิดกฎหมาย หรือกระทบต่อความปลอดภัยของระบบ</li>
          <li>สิทธิประโยชน์/คะแนน/สถานะสมาชิกเป็นไปตามกติกาและเงื่อนไขของโปรแกรม</li>
          <li>ผู้ให้บริการอาจปรับปรุงเงื่อนไขเป็นครั้งคราว โดยจะแจ้งเวอร์ชันที่เปลี่ยนแปลงตามความเหมาะสม</li>
        </ul>
      </div>

      <div className="text-[12px] text-white/45">
        * เอกสารนี้เป็นตัวอย่างเพื่อใช้งานใน Demo เท่านั้น ไม่ใช่เอกสารทางกฎหมาย
      </div>
    </div>
  );
}
