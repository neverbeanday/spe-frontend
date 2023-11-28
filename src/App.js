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

      // Recalculate the total
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

  

  return (
      <Flex>
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
