"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/core/common/header/user-nav";

// Animation variants for the logo
const logoVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: {
      duration: 0.3,
      yoyo: Infinity,
    },
  },
};

// Animation variants for the menu items
const menuItemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
  hover: {
    color: "#56D071",
    x: 5,
    transition: {
      duration: 0.3,
    },
  },
};

// Animation variants for the button
const buttonVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      yoyo: Infinity,
    },
  },
  tap: { scale: 0.95 },
};

const LandingHeader = () => {
  const { data: session } = useSession();
  const menuItems = [
    { label: "Trang chủ", href: "#" },
    { label: "Về chúng tôi", href: "#" },
    { label: "Khóa học", href: "#" },
    { label: "Tin tức", href: "#" },
    { label: "Liên hệ", href: "#" },
  ];

  return (
    <div className="w-full bg-white h-20 py-4 fixed top-0 left-0 z-50 shadow-md">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-row justify-between items-center h-full w-full">
          {/* Logo with animation */}
          <motion.div
            animate="visible"
            initial="hidden"
            variants={logoVariants}
            whileHover="hover"
          >
            <Link className="flex items-center" href="/">
              <Image
                alt="TechNihongo Logo"
                className="w-14 h-14"
                height={40}
                src="/assets/logo.png"
                width={40}
              />
            </Link>
          </motion.div>

          {/* Menu items with equal spacing */}
          <div className="hidden md:flex flex-1 justify-center space-x-12">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.label}
                animate="visible"
                custom={index}
                initial="hidden"
                variants={menuItemVariants}
                whileHover="hover"
              >
                <Link
                  className="text-gray-700 text-lg font-bold uppercase hover:text-[#56D071]"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Button with animation */}
          {session ? (
            <UserNav />
          ) : (
            <motion.div
              animate="visible"
              className="flex justify-end w-[200px]"
              initial="hidden"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link href="/Login">
                <Button className="bg-gradient-to-r from-[#56D071] to-[#48BA63] hover:from-[#48BA63] hover:to-[#3DA554] text-white px-6 py-2 rounded-full">
                  ĐĂNG NHẬP
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingHeader;
