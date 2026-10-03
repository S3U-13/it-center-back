"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // 1. เพิ่มกลุ่มสิทธิ์หลัก (itcenter_roles)
    await queryInterface.bulkInsert(
      "itcenter_roles",
      [
        {
          id: 1,
          role_code: "super_admin",
          role_name: "Super Administrator",
          description:
            "ผู้ดูแลระบบสูงสุด สิทธิ์เข้าถึงทุกเมนู ทุก API และคำสั่งระดับ Root",
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 2,
          role_code: "it_devops",
          role_name: "IT DevOps & Infrastructure",
          description:
            "ดูแล Server, Docker, SSH, Network, Database และ Deployment Pipeline",
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 3,
          role_code: "it_programmer",
          role_name: "IT Software Developer",
          description:
            "พัฒนา Application, Clone Repository, จัดการ Config และดู Logs",
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 4,
          role_code: "it_support",
          role_name: "IT Support & Helpdesk",
          description:
            "ดูแลผู้ใช้งาน ดูภาพรวม Health Monitoring และ Logs ทั่วไป",
          createdAt: now,
          updatedAt: now,
        },
      ],
      { updateOnDuplicate: ["role_name", "description", "updatedAt"] },
    );

    // 2. กำหนด Role เริ่มต้นให้ User ตัวคุณ (ตัวอย่าง: userid = 1 ให้เป็น Super Admin + DevOps + Dev)
    // 👉 สามารถเปลี่ยนเลข 1 เป็น userid ของคุณในระบบ centralusers ได้เลยครับ
    const targetUserId = 14173;

    await queryInterface.bulkInsert(
      "itcenter_user_roles",
      [
        {
          userid: targetUserId,
          role_id: 1, // super_admin
          createdAt: now,
          updatedAt: now,
        },
        {
          userid: targetUserId,
          role_id: 2, // it_devops
          createdAt: now,
          updatedAt: now,
        },
        {
          userid: targetUserId,
          role_id: 3, // it_programmer
          createdAt: now,
          updatedAt: now,
        },
      ],
      { ignoreDuplicates: true },
    );

    // 3. กำหนดสิทธิ์พิเศษเฉพาะบุคคล (User-level Custom Permissions)
    await queryInterface.bulkInsert(
      "itcenter_user_permissions",
      [
        {
          userid: targetUserId,
          permission_key: "*", // Wildcard Full Access ทะลุผ่านทุกด่าน
          is_granted: true,
          createdAt: now,
          updatedAt: now,
        },
      ],
      { ignoreDuplicates: true },
    );
  },

  async down(queryInterface, Sequelize) {
    // ลบข้อมูลย้อนกลับตามลำดับ Foreign Key
    await queryInterface.bulkDelete("itcenter_user_permissions", null, {});
    await queryInterface.bulkDelete("itcenter_user_roles", null, {});
    await queryInterface.bulkDelete("itcenter_roles", null, {});
  },
};
