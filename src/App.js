// src/components/Header.js
import React, { useState, useEffect } from 'react';
import './App.css';
import axios from "axios";
import { Flex, Table, Image, Typography, Select } from 'antd';
const { Text, Title } = Typography;


function App() {
  const [dataCar, setDataCar ] = useState(null)
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getDataCar()
  }, []);

  const columns = [
    {
      title: 'PRODUCT',
      dataIndex: 'product',
      key: 'product',
      render: (dataProduct) => (
        <Flex gap={'20px'} className='detail-product'>
          <Image width={200} src={dataProduct.media_url} preview={false} alt="Product" />
          <Flex vertical>
            <Text className='product-code'>{dataProduct.code}</Text>
            <Title level={3} className='product-name'>{dataProduct.name}</Title>
            <Text className='product-price'>IDR. {dataProduct.price.toLocaleString()}</Text>
            <Text className='product-stock'>{dataProduct.stock} in stock</Text>
          </Flex>
        </Flex>
      ),
    },
    {
      title: 'QUANTITY',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (record) => (
        <Select
          defaultValue={"0"}
          onChange={(value) => handleQuantityChange(record, value)}
        >
          {[0, 1, 2, 3, 4, 5].map((count) => (
            <Select.Option key={count} value={count}>
              {count}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'SUBTOTAL',
      dataIndex: 'subtotal',
      key: 'subtotal',
      render: (text) => (
        <Text>IDR. {text}</Text>
      ),
    },
  ];

  function handleQuantityChange(record, value) {
    setDataCar((prevDataCar) => {
      const updatedDataCar = prevDataCar.map((item) =>
        item.product.code === record.product.code
          ? {
              ...item,
              quantity: value,
              subtotal: value * (item.product?.price || 0),
            }
          : item
      );

      const newTotal = updatedDataCar.reduce((acc, item) => acc + (item.subtotal || 0), 0);
      setTotal(newTotal);

      return updatedDataCar;
    });
  }

  const dataSourceListCar = dataCar 
  ? dataCar.map((item) => {
    console.log(item)
    return {
      product: item.product,
      quantity: item,
      subtotal: (item.subtotal?.toLocaleString() || 0),
    }
  }) : null;

  const getDataCar = () => {
    const URL = 'https://spe-academy.spesolution.com/api/recruitment';
    const headers = {
      "Content-Type": "application/json",
      "Authorization": 'Bearer o7Ytbt9XQLI3PgtebJfKSXKEf0XHU74Y'
    };
    axios
    .get(URL, {headers})
    .then((response) => {
      if (response.status === 200) {
        setDataCar(response.data)
      }
    })
    .catch((error) => {
      console.log(error)
    })
  }


  const currentDate = new Date();
  const options = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  };

  const day = currentDate.getDate();
  const suffix = getDaySuffix(day);
  const formattedDateString = currentDate.toLocaleString('en-US', options).replace(/\d{2}/, day + suffix).replace("at", " - ");

function getDaySuffix(day) {
  if (day >= 11 && day <= 13) {
    return 'th';
  }
  const lastDigit = day % 10;
  switch (lastDigit) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

  return (
      <Flex vertical justify='center' align='center' gap={'50px'}>
        <div className='header-shop'>
          <div className='header-shop-black-board'>
            <Title level={1} className='project-name'>&lt; SPE / FRONTEND &gt;</Title>
            <Title level={3} className='project-timestamp'>{formattedDateString}</Title>

          </div>
        </div>
        <Title level={2}>SPE Frontend Shop</Title>
        <Table 
          className='table-content'
          columns={columns} 
          dataSource={dataSourceListCar}
          footer={() => 
          (
            <Flex justify='flex-end' gap={'50px'}>
              <Text strong>TOTAL:</Text>
              <Text strong>IDR. {total.toLocaleString()}</Text>
            </Flex>
          )}
        />
      </Flex>
  );
}

export default App;
