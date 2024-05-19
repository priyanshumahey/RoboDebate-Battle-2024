"use client"

import React from 'react';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-[100vh] overflow-hidden">
            <main className="flex flex-col p-4 md:p-12 h-[100vh] ">{children}</main>
        </div>
    );
}
