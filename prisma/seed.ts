import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { hash } from "@node-rs/argon2";
import { toSlug } from "../src/lib/utils";
import { randomUUID } from "crypto";

async function main() {
  await prisma.room_Class_Bed_Type.deleteMany();
  await prisma.room_Class.deleteMany();
  await prisma.room.deleteMany();
  await prisma.floor.deleteMany();
  await prisma.feature.deleteMany();
  await prisma.addon.deleteMany();
  await prisma.bed_Type.deleteMany();
  await prisma.room_Status.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await hash("password", {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  //floor
  await prisma.floor.create({
    data: {
      id: "16b58211-b27e-40f9-8af6-fde37887cea1",
      floor_number: 1,
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.floor.create({
    data: {
      id: "3a88dba7-219e-4454-897d-84afd0310579",
      floor_number: 2,
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.floor.create({
    data: {
      id: "4b6d9d23-2147-4f7d-b81d-afa4b7472170",
      floor_number: 3,
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.floor.create({
    data: {
      id: "5c9191c4-1f61-4f2b-8411-f415db92873a",
      floor_number: 4,
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.floor.create({
    data: {
      id: "9779f2de-4439-4601-a775-2927c01783a5",
      floor_number: 5,
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.floor.create({
    data: {
      id: "a356834b-2fa3-48a7-bdfa-ef99b1f773b5",
      floor_number: 6,
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.floor.create({
    data: {
      id: "ac4f9b3f-029a-4d42-a297-db5cc65d8cbc",
      floor_number: 7,
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.floor.create({
    data: {
      id: "b78236f4-2023-48f6-8a64-adabab69a712",
      floor_number: 8,
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.floor.create({
    data: {
      id: "b9269149-0540-4e45-8b7e-7b4cb51b45bb",
      floor_number: 9,
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.floor.create({
    data: {
      id: "d8cb7e7d-c639-4590-8371-91536ea2a374",
      floor_number: 10,
      createdBy: "mailmonir@gmail.com",
    },
  });

  //users
  await prisma.user.create({
    data: {
      id: "5361c2b9-95cc-40fb-8794-67cc4156f590",
      name: "Monirul Islam",
      email: "mailmonir@gmail.com",
      role: "admin",
      passwordHash: passwordHash,
      emailVerified: true,
      bio: "I am a super admin",
      avatarUrl: ["/uploads/FD5XC1l4VpiOJujT-REbo-user.jpg"],
      providerId: "user",
    },
  });
  await prisma.user.create({
    data: {
      id: "6d0eaec2-149b-43b5-89b9-31ffdd958c35",
      name: "Leanne Graham",
      email: "Sincere@april.biz",
      role: "admin",
      passwordHash: passwordHash,
      emailVerified: true,
      bio: "I am an admin",
      avatarUrl: ["/uploads/r5yxjKo2JhaQwpVfUs4T1-user-1.jpg"],
      providerId: "user",
    },
  });
  await prisma.user.create({
    data: {
      id: "7908f4c1-0fad-4df7-98d2-32472c1ed214",
      name: "Ervin Howell",
      email: "Shanna@melissa.tv",
      role: "manager",
      passwordHash: passwordHash,
      emailVerified: true,
      bio: "I am a buyer",
      avatarUrl: ["/uploads/XN4Fa65f7I-7UgI8RKzGp-user-4.jpg"],
      providerId: "user",
    },
  });
  await prisma.user.create({
    data: {
      id: "83fa9846-d4b6-4427-94f6-900c2aea368e",
      name: "Clementine Bauch",
      email: "Nathan@yesenia.net",
      role: "guest",
      passwordHash: passwordHash,
      emailVerified: true,
      bio: "I am a seller",
      avatarUrl: ["/uploads/ebWo099kIgmBkf2LmPcMk-user-3.jpg"],
      providerId: "user",
    },
  });
  await prisma.user.create({
    data: {
      id: "bba7f6ec-aff1-4b34-bc0c-f84732950761",
      name: "Patricia Lebsack",
      email: "Julianne.OConner@kory.org",
      role: "manager",
      passwordHash: passwordHash,
      emailVerified: true,
      bio: "I am a manager",
      avatarUrl: ["/uploads/7t7_rwRFFe4wKdz2KSOiI-user-2.jpg"],
      providerId: "user",
    },
  });
  await prisma.user.create({
    data: {
      id: "bf883684-c95e-4f84-9528-1ef83c3c5acd",
      name: "Chelsey Dietrich",
      email: "Lucio_Hettinger@annie.ca",
      role: "guest",
      passwordHash: passwordHash,
      emailVerified: true,
      bio: "I am a buyer",
      avatarUrl: ["/uploads/eiRzCM0_1Kaxm9lVUAwmd-user-5.jpg"],
      providerId: "user",
    },
  });
  await prisma.user.create({
    data: {
      id: "e25522a7-ac10-4fae-a53a-c14e85f56fef",
      name: "Leopoldo_Corkery",
      email: "Karley_Dach@jasper.info",
      role: "guest",
      passwordHash: passwordHash,
      emailVerified: true,
      bio: "I am a buyer",
      avatarUrl: ["/uploads/5cPjqgo-KoQragn6ige2a-user-6.jpg"],
      providerId: "user",
    },
  });

  //room class
  await prisma.room_Class.create({
    data: {
      id: "9c373739-8475-424b-8f0d-b358297150f0",
      slug: toSlug("Standart"),
      class_name: "Standart",
      base_price: 119,
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.room_Class.create({
    data: {
      id: "175658a3-2bb7-42f4-9b72-53f0f3530cfd",
      slug: toSlug("Deluxe"),
      class_name: "Deluexe",
      base_price: 129,
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.room_Class.create({
    data: {
      id: "cd8455d5-e79d-43a0-b13f-95a8f4b8b84c",
      slug: toSlug("Premier"),
      class_name: "Premier",
      base_price: 139,
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.room_Class.create({
    data: {
      id: "f790efa2-ff6a-4793-9ff8-37cba0e67788",
      slug: toSlug("Family"),
      class_name: "Family",
      base_price: 149,
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.room_Class.create({
    data: {
      id: "7f29c006-0f9c-40b2-be28-c8679112ec3e",
      slug: toSlug("Luxury"),
      class_name: "Luxury",
      base_price: 179,
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.room_Class.create({
    data: {
      id: "8df4ea51-6ed5-4574-bf2e-cf39a025401e",
      slug: toSlug("Presidential"),
      class_name: "Presidential",
      base_price: 199,
      createdBy: "mailmonir@gmail.com",
    },
  });

  //addon
  await prisma.addon.create({
    data: {
      id: "b09c3623-1694-4971-b7b1-dc1baf879a4e",
      slug: toSlug("Cafe & Restaurant"),
      addon_name: "Cafe & Restaurant",
      price: 10,
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.addon.create({
    data: {
      id: "1d35e8aa-b4e7-49dd-a209-ab85de2271bc",
      slug: toSlug("Swimming Pool"),
      addon_name: "Swimming Pool",
      price: 20,
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.addon.create({
    data: {
      id: "18a5f775-1085-4fd2-a1a1-1b813dd477f8",
      slug: toSlug("Spa & Massage"),
      addon_name: "Spa & Massage",
      price: 30,
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.addon.create({
    data: {
      id: "106ddbc1-741c-4cf8-a055-d650b3887791",
      slug: toSlug("Fitness Center"),
      addon_name: "Fitness Center",
      price: 40,
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.addon.create({
    data: {
      id: "3e3e4548-aa3a-4a43-819d-8d645340cf09",
      slug: toSlug("Laundry Service"),
      addon_name: "Laundry Service",
      price: 50,
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.addon.create({
    data: {
      id: "fbb7f8e5-3bf4-45ed-ae26-ab37bed34950",
      slug: toSlug("Meeting Room"),
      addon_name: "Meeting Room",
      price: 60,
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.addon.create({
    data: {
      id: "84b15de2-190a-482f-95b2-5897627a9c75",
      slug: toSlug("Parking"),
      addon_name: "Parking",
      price: 10,
      createdBy: "mailmonir@gmail.com",
    },
  });

  //features
  await prisma.feature.create({
    data: {
      id: "4bb34677-7d10-4d60-af34-069a3a819824",
      feature_name: "Air Condition",
      slug: toSlug("Air Condition"),
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.feature.create({
    data: {
      id: "9e0b7134-193b-4e41-9b7f-30c475a67a9f",
      feature_name: "Balcony",
      slug: toSlug("Balcony"),
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.feature.create({
    data: {
      id: "cc073378-dbe3-401f-bc14-bb5a1536f73a",
      feature_name: "Cable TV",
      slug: toSlug("Cable TV"),
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.feature.create({
    data: {
      id: "68bff1d7-105b-4cb2-80ba-87cc478c3ba9",
      slug: toSlug("Central Heating"),
      feature_name: "Central Heating",
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.feature.create({
    data: {
      id: "9710289d-bc6c-4a22-92bf-d2073dc244c1",
      slug: toSlug("Desk"),
      feature_name: "Desk",
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.feature.create({
    data: {
      id: "77872563-9412-4cb7-8e14-3f2df560e010",
      slug: toSlug("Free Wifi"),
      feature_name: "Free Wifi",
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.feature.create({
    data: {
      id: "eb28f4a6-ec30-413e-b04b-23d357e93bb8",
      slug: toSlug("Hair Dryer"),
      feature_name: "Hair Dryer",
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.feature.create({
    data: {
      id: "332e9b45-3508-4525-8301-a425f4af46a8",
      slug: toSlug("Ironing Board"),
      feature_name: "Ironing Board",
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.feature.create({
    data: {
      id: "32b20163-1241-4cab-b09e-fa26f6c4bbc6",
      slug: toSlug("Mini Bar"),
      feature_name: "Mini Bar",
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.feature.create({
    data: {
      id: "118ca242-fa47-4f5d-9633-cf5a0096f7e5",
      slug: toSlug("Openable Windows"),
      feature_name: "Openable Windows",
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.feature.create({
    data: {
      id: "38f24995-36f3-4d6b-ac91-75635c153c0d",
      slug: toSlug("Safe"),
      feature_name: "Safe",
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.feature.create({
    data: {
      id: "534bb8d9-e910-471f-b832-05a033085d17",
      slug: toSlug("Satelite TV"),
      feature_name: "Satelite TV",
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.feature.create({
    data: {
      id: "e77bdf7a-9b82-41aa-a979-ddf2c305e0c2",
      slug: toSlug("Shower"),
      feature_name: "Shower",
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.feature.create({
    data: {
      id: "16b58211-b27e-40f9-8af6-fde37887cea1",
      slug: toSlug("Television"),
      feature_name: "Television",
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.feature.create({
    data: {
      id: "48add2c9-a94e-4836-810e-01b927a321ed",
      slug: toSlug("Closet"),
      feature_name: "Closet",
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.feature.create({
    data: {
      id: "fbcd2a4f-2c17-4488-b21f-ba4518e0d6b4",
      slug: toSlug("Coffee Maker"),
      feature_name: "Coffee Maker",
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.feature.create({
    data: {
      id: "cf873f4d-95a4-4e94-8b1a-e9c5483332bb",
      slug: toSlug("Sitting Area"),
      feature_name: "Sitting Area",
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.feature.create({
    data: {
      id: "011e5af7-6732-4ce1-9f3a-111c9f46b7a3",
      slug: toSlug("Bathtub"),
      feature_name: "Buthtub",
      createdBy: "mailmonir@gmail.com",
    },
  });

  //bed type
  await prisma.bed_Type.create({
    data: {
      id: "cb564b07-9ac9-4381-8ab8-620d7973f23a",
      slug: toSlug("Single"),
      bed_type_name: "Single",
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.bed_Type.create({
    data: {
      id: "9fff3e00-e754-414f-8b11-74dc9c1de46e",
      slug: toSlug("Double"),
      bed_type_name: "Double",
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.bed_Type.create({
    data: {
      id: "3e7d757b-fe9c-4f57-b3ac-55a1b2f2123b",
      slug: toSlug("Tripple"),
      bed_type_name: "Tripple",
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.bed_Type.create({
    data: {
      id: "c5698430-0f3f-4ff2-92d9-480d4a6c5138",
      slug: toSlug("King Size"),
      bed_type_name: "King Size",
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.bed_Type.create({
    data: {
      id: "8acd368a-9ecd-408a-93b2-522f61389c88",
      slug: toSlug("Queen Size"),
      bed_type_name: "Queen Size",
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.bed_Type.create({
    data: {
      id: "38e79a01-8260-4010-8523-7be079d544ae",
      slug: toSlug("Twin"),
      bed_type_name: "Twin",
      createdBy: "mailmonir@gmail.com",
    },
  });

  //room status
  await prisma.room_Status.create({
    data: {
      id: "5d941200-b4c9-4e47-bc15-632724b9d47a",
      slug: toSlug("Available"),
      status_name: "Available",
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.room_Status.create({
    data: {
      id: "c853b77c-04ec-4ccd-b1d6-7a997b679a23",
      slug: toSlug("Reserved"),
      status_name: "Reserved",
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.room_Status.create({
    data: {
      id: "caec08d0-82f0-4bf8-833b-132fe9c6366e",
      slug: toSlug("Occupied"),
      status_name: "Occupied",
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.room_Status.create({
    data: {
      id: "08889f1b-70fc-4a39-a287-d4e2f102dbed",
      slug: toSlug("Maintenance"),
      status_name: "Maintenance",
      createdBy: "mailmonir@gmail.com",
    },
  });

  //room
  await prisma.room.create({
    data: {
      id: "b502f135-e0cd-4922-b242-a4aad628cc7e",
      floor_id: "3a88dba7-219e-4454-897d-84afd0310579",
      room_class_id: "9c373739-8475-424b-8f0d-b358297150f0",
      room_status_id: "5d941200-b4c9-4e47-bc15-632724b9d47a",
      room_number: "201",
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.room.create({
    data: {
      id: "a4d50601-cbae-4fdc-ac28-2ab04f55562b",
      floor_id: "3a88dba7-219e-4454-897d-84afd0310579",
      room_class_id: "175658a3-2bb7-42f4-9b72-53f0f3530cfd",
      room_status_id: "c853b77c-04ec-4ccd-b1d6-7a997b679a23",
      room_number: "202",
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.room.create({
    data: {
      id: "c801cd9b-8f6f-4f5f-b695-ccda14808334",
      floor_id: "4b6d9d23-2147-4f7d-b81d-afa4b7472170",
      room_class_id: "cd8455d5-e79d-43a0-b13f-95a8f4b8b84c",
      room_status_id: "caec08d0-82f0-4bf8-833b-132fe9c6366e",
      room_number: "301",
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.room.create({
    data: {
      id: "9ac03547-4de2-46f5-9e8c-eb4aeb13ac82",
      floor_id: "4b6d9d23-2147-4f7d-b81d-afa4b7472170",
      room_class_id: "f790efa2-ff6a-4793-9ff8-37cba0e67788",
      room_status_id: "08889f1b-70fc-4a39-a287-d4e2f102dbed",
      room_number: "302",
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.room.create({
    data: {
      id: "3a1c05be-eee5-417d-aadf-eb25b5c598cc",
      floor_id: "5c9191c4-1f61-4f2b-8411-f415db92873a",
      room_class_id: "7f29c006-0f9c-40b2-be28-c8679112ec3e",
      room_status_id: "c853b77c-04ec-4ccd-b1d6-7a997b679a23",
      room_number: "401",
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.room.create({
    data: {
      id: "a8e1479b-69cd-4d48-8546-1dd48e6e094f",
      floor_id: "5c9191c4-1f61-4f2b-8411-f415db92873a",
      room_class_id: "8df4ea51-6ed5-4574-bf2e-cf39a025401e",
      room_status_id: "caec08d0-82f0-4bf8-833b-132fe9c6366e",
      room_number: "402",
      createdBy: "mailmonir@gmail.com",
    },
  });

  //payment status
  await prisma.payment_Status.create({
    data: {
      id: randomUUID(),
      payment_status_name: "Pending",
      slug: toSlug("Pending"),
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.payment_Status.create({
    data: {
      id: randomUUID(),
      payment_status_name: "Awaiting",
      slug: toSlug("Awaiting"),
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.payment_Status.create({
    data: {
      id: randomUUID(),
      payment_status_name: "Partially Paid",
      slug: toSlug("Partially Paid"),
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.payment_Status.create({
    data: {
      id: randomUUID(),
      payment_status_name: "Paid",
      slug: toSlug("Paid"),
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.payment_Status.create({
    data: {
      id: randomUUID(),
      payment_status_name: "Failed",
      slug: toSlug("Failed"),
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.payment_Status.create({
    data: {
      id: randomUUID(),
      payment_status_name: "Refunded",
      slug: toSlug("Refunded"),
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.payment_Status.create({
    data: {
      id: randomUUID(),
      payment_status_name: "Cancel",
      slug: toSlug("Cancel"),
      createdBy: "mailmonir@gmail.com",
    },
  });
  await prisma.payment_Status.create({
    data: {
      id: randomUUID(),
      payment_status_name: "Payment at Hotel",
      slug: toSlug("Payment at Hotel"),
      createdBy: "mailmonir@gmail.com",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
