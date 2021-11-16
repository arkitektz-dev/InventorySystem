
-- --------------------------------------------------
-- Entity Designer DDL Script for SQL Server 2005, 2008, 2012 and Azure
-- --------------------------------------------------
-- Date Created: 10/18/2021 12:27:19
-- Generated from EDMX file: D:\InventorySystem\InventorySystem\InventorySystem\Models\InventorySystemModel.edmx
-- --------------------------------------------------

SET QUOTED_IDENTIFIER OFF;
GO
USE [InventorySystem];
GO
IF SCHEMA_ID(N'dbo') IS NULL EXECUTE(N'CREATE SCHEMA [dbo]');
GO

-- --------------------------------------------------
-- Dropping existing FOREIGN KEY constraints
-- --------------------------------------------------


-- --------------------------------------------------
-- Dropping existing tables
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[PO]', 'U') IS NOT NULL
    DROP TABLE [dbo].[PO];
GO
IF OBJECT_ID(N'[dbo].[PODetails]', 'U') IS NOT NULL
    DROP TABLE [dbo].[PODetails];
GO
IF OBJECT_ID(N'[dbo].[Product]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Product];
GO
IF OBJECT_ID(N'[dbo].[ProductPictures]', 'U') IS NOT NULL
    DROP TABLE [dbo].[ProductPictures];
GO
IF OBJECT_ID(N'[dbo].[ProductStock]', 'U') IS NOT NULL
    DROP TABLE [dbo].[ProductStock];
GO
IF OBJECT_ID(N'[dbo].[ProductType]', 'U') IS NOT NULL
    DROP TABLE [dbo].[ProductType];
GO
IF OBJECT_ID(N'[dbo].[Stock]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Stock];
GO
IF OBJECT_ID(N'[dbo].[Supplier]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Supplier];
GO
IF OBJECT_ID(N'[dbo].[User]', 'U') IS NOT NULL
    DROP TABLE [dbo].[User];
GO
IF OBJECT_ID(N'[dbo].[Warehouse]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Warehouse];
GO
IF OBJECT_ID(N'[InventorySystemModelStoreContainer].[PODetailV]', 'U') IS NOT NULL
    DROP TABLE [InventorySystemModelStoreContainer].[PODetailV];
GO
IF OBJECT_ID(N'[InventorySystemModelStoreContainer].[PoV]', 'U') IS NOT NULL
    DROP TABLE [InventorySystemModelStoreContainer].[PoV];
GO
IF OBJECT_ID(N'[InventorySystemModelStoreContainer].[ProductV]', 'U') IS NOT NULL
    DROP TABLE [InventorySystemModelStoreContainer].[ProductV];
GO
IF OBJECT_ID(N'[InventorySystemModelStoreContainer].[StockV]', 'U') IS NOT NULL
    DROP TABLE [InventorySystemModelStoreContainer].[StockV];
GO

-- --------------------------------------------------
-- Creating all tables
-- --------------------------------------------------

-- Creating table 'Products'
CREATE TABLE [dbo].[Products] (
    [ProductId] int IDENTITY(1,1) NOT NULL,
    [ProductCode] varchar(150)  NULL,
    [ProductName] varchar(150)  NULL,
    [Description] varchar(max)  NULL,
    [Barcode] varchar(150)  NULL,
    [SNo] int  NULL,
    [ProductTypeId] int  NULL,
    [UnitOfMeasure] varchar(50)  NULL,
    [Price] decimal(19,4)  NULL,
    [QtyInHand] decimal(18,2)  NULL,
    [IsActive] bit  NULL,
    [WarehouseId] int  NULL
);
GO

-- Creating table 'ProductPictures'
CREATE TABLE [dbo].[ProductPictures] (
    [ProductPictureId] int IDENTITY(1,1) NOT NULL,
    [ProductId] int  NULL,
    [IsDeleted] bit  NULL
);
GO

-- Creating table 'ProductStocks'
CREATE TABLE [dbo].[ProductStocks] (
    [StockId] int IDENTITY(1,1) NOT NULL,
    [WarhouseId] int  NULL,
    [ProductId] int  NULL,
    [Location] varchar(350)  NULL,
    [QuantityReceiving] decimal(18,2)  NULL,
    [QuantityOnHand] decimal(18,2)  NULL
);
GO

-- Creating table 'Warehouses'
CREATE TABLE [dbo].[Warehouses] (
    [WarehouseId] int IDENTITY(1,1) NOT NULL,
    [Warehouse1] varchar(350)  NULL,
    [Address1] varchar(500)  NULL,
    [Address2] varchar(500)  NULL,
    [Suburb] varchar(350)  NULL,
    [City] varchar(150)  NULL,
    [Country] varchar(250)  NULL,
    [IsDeleted] bit  NULL
);
GO

-- Creating table 'Users'
CREATE TABLE [dbo].[Users] (
    [UserId] int IDENTITY(1,1) NOT NULL,
    [Email] varchar(250)  NULL,
    [UserName] varchar(250)  NULL,
    [Password] varchar(50)  NULL
);
GO

-- Creating table 'ProductTypes'
CREATE TABLE [dbo].[ProductTypes] (
    [TypeId] int IDENTITY(1,1) NOT NULL,
    [Type] varchar(250)  NULL
);
GO

-- Creating table 'ProductVs'
CREATE TABLE [dbo].[ProductVs] (
    [ProductId] int  NOT NULL,
    [ProductCode] varchar(150)  NULL,
    [ProductName] varchar(150)  NULL,
    [Description] varchar(max)  NULL,
    [Barcode] varchar(150)  NULL,
    [SNo] int  NULL,
    [WarehouseId] int  NULL,
    [ProductTypeId] int  NULL,
    [UnitOfMeasure] varchar(50)  NULL,
    [Price] decimal(19,4)  NULL,
    [QtyInHand] decimal(18,2)  NULL,
    [IsActive] bit  NULL,
    [Type] varchar(250)  NULL,
    [Warehouse] varchar(350)  NULL,
    [QOH] decimal(38,2)  NULL
);
GO

-- Creating table 'POes'
CREATE TABLE [dbo].[POes] (
    [POId] int IDENTITY(1,1) NOT NULL,
    [Date] datetime  NULL,
    [DeliveryDate] datetime  NULL,
    [SupplierId] int  NULL,
    [Status] varchar(50)  NULL,
    [Description] varchar(max)  NULL,
    [DeliveryAddress] varchar(max)  NULL,
    [RefNumber] varchar(50)  NULL,
    [PONumber] varchar(50)  NULL
);
GO

-- Creating table 'PODetails'
CREATE TABLE [dbo].[PODetails] (
    [PODetailId] int IDENTITY(1,1) NOT NULL,
    [POId] int  NULL,
    [ProductId] int  NULL,
    [Quantity] decimal(18,2)  NULL,
    [Price] decimal(19,4)  NULL,
    [Discount] decimal(19,4)  NULL,
    [Total] decimal(19,4)  NULL
);
GO

-- Creating table 'Suppliers'
CREATE TABLE [dbo].[Suppliers] (
    [SupplierId] int IDENTITY(1,1) NOT NULL,
    [Supplier1] varchar(250)  NULL,
    [Description] varchar(max)  NULL,
    [Address1] varchar(500)  NULL,
    [Address2] varchar(500)  NULL,
    [Suburb] varchar(250)  NULL,
    [City] varchar(150)  NULL,
    [Country] varchar(150)  NULL
);
GO

-- Creating table 'PODetailVs'
CREATE TABLE [dbo].[PODetailVs] (
    [ProductCode] varchar(150)  NULL,
    [ProductName] varchar(150)  NULL,
    [Barcode] varchar(150)  NULL,
    [PODetailId] int  NOT NULL,
    [Quantity] decimal(18,2)  NULL,
    [Price] decimal(19,4)  NULL,
    [Discount] decimal(19,4)  NULL,
    [Total] decimal(19,4)  NULL,
    [POId] int  NULL
);
GO

-- Creating table 'PoVs'
CREATE TABLE [dbo].[PoVs] (
    [POId] int  NOT NULL,
    [Date] datetime  NULL,
    [DeliveryDate] datetime  NULL,
    [SupplierId] int  NULL,
    [Status] varchar(50)  NULL,
    [Description] varchar(max)  NULL,
    [DeliveryAddress] varchar(max)  NULL,
    [RefNumber] varchar(50)  NULL,
    [Supplier] varchar(250)  NULL,
    [PONumber] varchar(50)  NULL
);
GO

-- Creating table 'Stocks'
CREATE TABLE [dbo].[Stocks] (
    [StockId] int IDENTITY(1,1) NOT NULL,
    [Location] varchar(350)  NULL,
    [WarehouseId] int  NULL,
    [ProductId] int  NULL,
    [QuantityReceiving] decimal(18,2)  NULL,
    [QuantityOnHand] decimal(18,2)  NULL
);
GO

-- Creating table 'StockVs'
CREATE TABLE [dbo].[StockVs] (
    [StockId] int  NOT NULL,
    [Location] varchar(350)  NULL,
    [WarehouseId] int  NULL,
    [ProductId] int  NULL,
    [QuantityReceiving] decimal(18,2)  NULL,
    [QuantityOnHand] decimal(18,2)  NULL,
    [ProductName] varchar(150)  NULL,
    [Warehouse] varchar(350)  NULL,
    [Barcode] varchar(150)  NULL
);
GO

-- --------------------------------------------------
-- Creating all PRIMARY KEY constraints
-- --------------------------------------------------

-- Creating primary key on [ProductId] in table 'Products'
ALTER TABLE [dbo].[Products]
ADD CONSTRAINT [PK_Products]
    PRIMARY KEY CLUSTERED ([ProductId] ASC);
GO

-- Creating primary key on [ProductPictureId] in table 'ProductPictures'
ALTER TABLE [dbo].[ProductPictures]
ADD CONSTRAINT [PK_ProductPictures]
    PRIMARY KEY CLUSTERED ([ProductPictureId] ASC);
GO

-- Creating primary key on [StockId] in table 'ProductStocks'
ALTER TABLE [dbo].[ProductStocks]
ADD CONSTRAINT [PK_ProductStocks]
    PRIMARY KEY CLUSTERED ([StockId] ASC);
GO

-- Creating primary key on [WarehouseId] in table 'Warehouses'
ALTER TABLE [dbo].[Warehouses]
ADD CONSTRAINT [PK_Warehouses]
    PRIMARY KEY CLUSTERED ([WarehouseId] ASC);
GO

-- Creating primary key on [UserId] in table 'Users'
ALTER TABLE [dbo].[Users]
ADD CONSTRAINT [PK_Users]
    PRIMARY KEY CLUSTERED ([UserId] ASC);
GO

-- Creating primary key on [TypeId] in table 'ProductTypes'
ALTER TABLE [dbo].[ProductTypes]
ADD CONSTRAINT [PK_ProductTypes]
    PRIMARY KEY CLUSTERED ([TypeId] ASC);
GO

-- Creating primary key on [ProductId] in table 'ProductVs'
ALTER TABLE [dbo].[ProductVs]
ADD CONSTRAINT [PK_ProductVs]
    PRIMARY KEY CLUSTERED ([ProductId] ASC);
GO

-- Creating primary key on [POId] in table 'POes'
ALTER TABLE [dbo].[POes]
ADD CONSTRAINT [PK_POes]
    PRIMARY KEY CLUSTERED ([POId] ASC);
GO

-- Creating primary key on [PODetailId] in table 'PODetails'
ALTER TABLE [dbo].[PODetails]
ADD CONSTRAINT [PK_PODetails]
    PRIMARY KEY CLUSTERED ([PODetailId] ASC);
GO

-- Creating primary key on [SupplierId] in table 'Suppliers'
ALTER TABLE [dbo].[Suppliers]
ADD CONSTRAINT [PK_Suppliers]
    PRIMARY KEY CLUSTERED ([SupplierId] ASC);
GO

-- Creating primary key on [PODetailId] in table 'PODetailVs'
ALTER TABLE [dbo].[PODetailVs]
ADD CONSTRAINT [PK_PODetailVs]
    PRIMARY KEY CLUSTERED ([PODetailId] ASC);
GO

-- Creating primary key on [POId] in table 'PoVs'
ALTER TABLE [dbo].[PoVs]
ADD CONSTRAINT [PK_PoVs]
    PRIMARY KEY CLUSTERED ([POId] ASC);
GO

-- Creating primary key on [StockId] in table 'Stocks'
ALTER TABLE [dbo].[Stocks]
ADD CONSTRAINT [PK_Stocks]
    PRIMARY KEY CLUSTERED ([StockId] ASC);
GO

-- Creating primary key on [StockId] in table 'StockVs'
ALTER TABLE [dbo].[StockVs]
ADD CONSTRAINT [PK_StockVs]
    PRIMARY KEY CLUSTERED ([StockId] ASC);
GO

-- --------------------------------------------------
-- Creating all FOREIGN KEY constraints
-- --------------------------------------------------

-- --------------------------------------------------
-- Script has ended
-- --------------------------------------------------