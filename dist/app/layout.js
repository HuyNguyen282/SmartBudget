"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
exports.metadata = {
    title: "SmartBudget",
    description: "Kiểm soát tài chính trong tầm tay bạn",
};
function RootLayout({ children, }) {
    return (<html lang="vi">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>
      </head>
      <body>{children}</body> 
    </html>);
}
//# sourceMappingURL=layout.js.map