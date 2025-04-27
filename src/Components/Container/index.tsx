import {
  useCallback,
  memo,
  createElement,
  useMemo,
  useEffect,
  useState,
} from "react";
import { ContainerData } from "@/Data/Box";
import { Container } from "@Container/Box";
import { useContainerStore } from "@Store/ContainerStore";
import { FaCrown, FaUser } from "react-icons/fa";
import {
  Layout,
  Menu,
  Button,
  Switch,
  Space,
  Select,
  Divider,
  Flex,
  Form,
  SelectProps,
  Empty,
  notification,
  List,
  Spin,
  Radio,
  RadioChangeEvent,
  Pagination,
  PaginationProps,
  TreeSelect,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { BoxType,treeDataType } from "@Container/Type";
import { ShowBoxesType } from "@/Store/Type";
import { useBoxStore } from "@/Store/BoxStore";

function Containers() {
  const { Header, Content, Footer, Sider } = Layout;
  const [api, contextHolder] = notification.useNotification();

  const {
    ArrangingBox,
    BoxLargeThanContainer,
    ContainerBox,
    ReArrange,
    SetBoxes,
    SetAllContainers,
    SetDefaultContainer,
    ClearContainerBox,
    SetArrangingBox,
  } = useContainerStore();
  const { setShowBoxes } = useBoxStore();
  const [form] = Form.useForm();
  const [VIPOption, setVIPOption] = useState<SelectProps["options"]>();
  const [simpleOption, setSimpleOption] = useState<SelectProps["options"]>();
  const [selectedMenu, setSelectedMenu] = useState<string>();
  const [initedTree, setInitedTree] = useState<boolean>(false);
  const [loadState, setLoadState] = useState<boolean>(false);
  const { SHOW_PARENT } = TreeSelect;
  const [current, setCurrent] = useState(1);
  const [treeValue, setTreeValue] = useState<string[]>([]);
  const [typeOfShow, setTypeOfShow] = useState<"all" | "one">("all");

  const sortSizeOptions: SelectProps["options"] = useMemo(
    () => [
      {
        value: "ASC",
        label: "ASC",
      },
      {
        value: "DESC",
        label: "DESC",
      },
    ],
    [],
  );

  const ContainerOptions: SelectProps["options"] = useMemo(
    () => [
      {
        value: "Auto",
        label: "auto",
      },
      ...ContainerData.ContainerType.map((_type) => ({
        label: _type.name,
        value: _type.containerID.toString(),
      })),
    ],
    [ContainerData],
  );

  const items = useMemo(
    () => [
      {
        key: "1",
        icon: createElement(FaCrown),
        label: `VIP Customers`,
      },
      {
        key: "2",
        icon: createElement(FaUser),
        label: `Simple Customers`,
      },
    ],
    [],
  );

  const treeData: treeDataType[] = useMemo(() => {
    const grouped = new Map<string, { key: number; Box: BoxType[] }>();
    if (typeOfShow == "all") {
      ContainerBox.forEach((_containerBox) => {
        _containerBox.boxes.forEach((box) => {
          const _customer = ContainerData.customer.find(
            (_c) => _c.customerID == box?.customerId,
          );
          if (!grouped.has(_customer?.name ?? ""))
            grouped.set(_customer?.name ?? "", { key: 0, Box: [] });

          const _box = grouped.get(_customer?.name ?? "")?.Box;
          _box?.push(box);
          if (_box)
            grouped.set(_customer?.name ?? "", {
              key: _customer?.customerID ?? 0,
              Box: _box,
            });
        });
      });
    } else {
      ContainerBox[current - 1]?.boxes.forEach((box) => {
        const _customer = ContainerData.customer.find(
          (_c) => _c.customerID == box?.customerId,
        );
        if (!grouped.has(_customer?.name ?? ""))
          grouped.set(_customer?.name ?? "", { key: 0, Box: [] });

        const _box = grouped.get(_customer?.name ?? "")?.Box;
        _box?.push(box);
        if (_box)
          grouped.set(_customer?.name ?? "", {
            key: _customer?.customerID ?? 0,
            Box: _box,
          });
      });
    }

    const tree: treeDataType[] = [];

    for (const [title, boxes] of grouped.entries()) {
      const groupNode: treeDataType = {
        title,
        value: boxes.key.toString(),
        key: boxes.key.toString(),
        checked: true,
        children: boxes.Box.map((box) => ({
          title: `${box.title}-${box.index}`,
          value: `${boxes.key}_${box.index}`,
          key: `${boxes.key}_${box.index}`,
          checked: true,
        })),
      };
      tree.push(groupNode);
    }

    return tree;
  }, [ContainerBox, ContainerData, typeOfShow, current]);

  const getTreeIds = useCallback(
    (newValue: string[]) => {
      const Ids: ShowBoxesType[] = [];
      newValue.forEach((_val) => {
        if (_val.includes("_")) {
          const _Ids = _val.split("_");

          if (_Ids[1] && _Ids[0])
            Ids.push({
              _box: Number(_Ids[1] ?? 0),
              _container: Number(_Ids[0] ?? 0),
            });
        } else {
          ContainerBox.forEach((_con) => {
            _con.boxes.forEach((_box) => {
              if (_box.customerId == Number(_val)) {
                Ids.push({
                  _box: _box.index ?? 0,
                  _container: _box.customerId ?? 0,
                });
              }
            });
          });
        }
      });
      return Ids;
    },
    [ContainerBox],
  );
  const onChangeTreeValue = useCallback(
    (newValue: string[]) => {
      setTreeValue(newValue);
      setShowBoxes(getTreeIds(newValue));
    },
    [getTreeIds, setTreeValue, setShowBoxes],
  );

  const tProps = useMemo(
    () => ({
      treeData,
      value: treeValue,
      onChange: onChangeTreeValue,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      placeholder: "Please select",
      style: {
        width: "100%",
      },
    }),
    [treeValue, treeData, SHOW_PARENT, onChangeTreeValue],
  );

  const onMenuClick = useCallback(
    (e: { key: string }) => {
      setInitedTree(false);
      setLoadState(false);
      form.resetFields();
      SetDefaultContainer("auto");
      setTypeOfShow("all");
      ClearContainerBox();
      if (e.key == "1" && !VIPOption) {
        const _Customer = ContainerData.customer.filter(
          (customer) => customer.isVIP,
        );
        setVIPOption(
          _Customer.map((customer) => ({
            value: customer.customerID,
            label: customer.name,
          })),
        );
      } else if (e.key == "2" && !simpleOption) {
        const _Customer = ContainerData.customer.filter(
          (customer) => !customer.isVIP,
        );
        setSimpleOption(
          _Customer.map((customer) => ({
            value: customer.customerID,
            label: customer.name,
          })),
        );
      }
      setSelectedMenu(e.key);
    },
    [ContainerData, VIPOption, simpleOption],
  );
  const SortBox = useCallback(
    (box: BoxType[], box_size: "ASC" | "DESC", check_weight: boolean) => {
      if (box_size)
        box = box.sort((a, b) =>
          4 * (a.size.width + a.size.height + a.size.depth) <
          4 * (b.size.width + b.size.height + b.size.depth)
            ? box_size == "ASC"
              ? 1
              : -1
            : box_size == "ASC"
              ? -1
              : 1,
        );
      if (check_weight)
        box = box.sort((a, b) => (a.weight < b.weight ? 1 : -1));

      return box;
    },
    [],
  );
  const onFinish = useCallback(
    ({
      box_size,
      check_weight,
      customer,
    }: {
      box_size: "ASC" | "DESC";
      check_weight: boolean;
      customer: number | number[];
    }) => {
      const _Customer = Array.isArray(customer) ? customer : [customer];
      setInitedTree(false);
      setTypeOfShow("all");
      setLoadState(true);

      if (_Customer.length > 0) {
        SetArrangingBox(true);
        const Customer = ContainerData.customer.filter((_customer) =>
          _Customer.includes(_customer.customerID),
        );

        const box: BoxType[] = [];

        Customer.forEach((_customer) => {
          const customerBox: BoxType[] = [];
          _customer?.order.forEach((_order) => {
            _order.box.forEach((_box) => {
              for (let i = 0; i < _box.count; i++)
                customerBox.push({
                  ..._box,
                  orderId: _order.orderID,
                  customerId: _customer.customerID,
                });
            });
          });

          box.push(...SortBox(customerBox, box_size, check_weight));
        });

        SetBoxes(box.map((_box, index) => ({ ..._box, index })));

        ReArrange();
      } else
        api.open({
          message: "Alert",
          description: "Please select customer",
          showProgress: true,
          pauseOnHover: true,
        });
    },
    [ContainerData, SortBox, api],
  );
  const ChangeDefaultContainer = useCallback(
    (value: string) => {
      SetDefaultContainer(value);
    },
    [SetDefaultContainer],
  );

  const ShowType = useCallback((e: RadioChangeEvent) => {
    e.stopPropagation();
    e.stopPropagation();
    setTypeOfShow(e.target.value);
  }, []);

  const onChange: PaginationProps["onChange"] = useCallback((page: number) => {
    setCurrent(page);
  }, []);

  useEffect(() => {
    if (BoxLargeThanContainer.length > 0) {
      let text = "";
      BoxLargeThanContainer.forEach((_box) => {
        text = `${text} ${text ? "," : ""} ${_box.title}`;
      });
      api.open({
        message: "Notification Title",
        description: (
          <List
            itemLayout="horizontal"
            dataSource={BoxLargeThanContainer}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta key={item.index} title={item.title} />
              </List.Item>
            )}
          />
        ),
        //  `This Box Larger than Container ${text}`,
        showProgress: true,
        pauseOnHover: true,
      });
    }
  }, [api, BoxLargeThanContainer]);

  useEffect(() => {
    SetAllContainers(ContainerData.ContainerType);
  }, [SetAllContainers, ContainerData]);

  useEffect(() => {
    if (treeData && !initedTree) {
      setInitedTree(true);
      const preSelected: string[] = [];
      treeData.forEach((_treeData) => {
        if (_treeData.checked) preSelected.push(_treeData.value);
      });

      setTreeValue(preSelected);
      setShowBoxes(getTreeIds(preSelected));
    }
  }, [treeData]);

  return (
    <>
      {contextHolder}
      <Layout style={{ height: "100vh", backgroundColor: "#FDFAF6" }}>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          style={{ padding: 0, background: "#E1EEBC" }}
        >
          <Menu
            style={{
              marginTop: "70px",
              background: "#E1EEBC",
              height: "calc(100%-70px)",
            }}
            mode="inline"
            items={items}
            onClick={onMenuClick}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: "#E1EEBC" }} />
          <Content style={{ margin: "6px 4px 0" }}>
            <div
              style={{
                padding: 4,
                minHeight: 360,
                height: "100%",
                background: "#FDFAF6",
                borderRadius: "10px",
              }}
            >
              {selectedMenu ? (
                <>
                  <Space direction="horizontal" style={{ width: "100%" }}>
                    <Flex wrap gap="small">
                      <Form
                        form={form}
                        name="customized_form_controls"
                        layout="inline"
                        onFinish={onFinish}
                        size={"small"}
                        initialValues={{
                          check_weight: false,
                          box_size: "ASC",
                          container_type: "auto",
                        }}
                      >
                        <Form.Item name="check_weight" label="Check Weight">
                          <Switch />
                        </Form.Item>
                        <Form.Item name="box_size" label="Sort Box Size">
                          <Select
                            style={{ width: 100 }}
                            options={sortSizeOptions}
                          />
                        </Form.Item>
                        <Form.Item name="customer" label="Customer">
                          <Select
                            style={{ width: 200 }}
                            mode={selectedMenu == "2" ? "multiple" : undefined}
                            options={
                              selectedMenu == "1" ? VIPOption : simpleOption
                            }
                          />
                        </Form.Item>
                        <Form.Item
                          name="container_type"
                          label="Type Of Container"
                        >
                          <Select
                            style={{ width: 100 }}
                            onChange={ChangeDefaultContainer}
                            options={ContainerOptions}
                          />
                        </Form.Item>
                        <Form.Item>
                          <Button type="primary" htmlType="submit">
                            Submit
                          </Button>
                        </Form.Item>
                      </Form>
                    </Flex>
                  </Space>

                  {loadState ? (
                    ArrangingBox ? (
                      <>
                        <Divider />
                        <Flex
                          style={{ height: "100%", width: "100%" }}
                          justify={"center"}
                          align={"center"}
                        >
                          <Spin
                            indicator={
                              <LoadingOutlined style={{ fontSize: 48 }} spin />
                            }
                          />
                        </Flex>
                      </>
                    ) : (
                      <>
                        <Divider>Show Containers</Divider>
                        <Flex vertical gap="middle" align="center">
                          <Radio.Group
                            defaultValue="all"
                            value={typeOfShow}
                            buttonStyle="solid"
                            onChange={ShowType}
                          >
                            <Radio.Button value="all">
                              All Container
                            </Radio.Button>
                            <Radio.Button value="one">
                              One Container
                            </Radio.Button>
                          </Radio.Group>
                          <TreeSelect {...tProps} />
                        </Flex>
                        <Divider />
                        {typeOfShow == "one" ? (
                          <Flex vertical gap="middle" align="center">
                            <Pagination
                              current={current}
                              onChange={onChange}
                              pageSize={1}
                              total={ContainerBox.length}
                            />{" "}
                          </Flex>
                        ) : null}

                        <Container
                          typeOfShow={typeOfShow}
                          containerNumber={current}
                        />
                      </>
                    )
                  ) : (
                    <>
                      <Divider />
                      <Flex
                        style={{ height: "100%", width: "100%" }}
                        justify={"center"}
                        align={"center"}
                      >
                        <Empty description={false} />
                      </Flex>{" "}
                    </>
                  )}
                </>
              ) : (
                <>
                  <Divider />
                  <Flex
                    style={{ height: "100%", width: "100%" }}
                    justify={"center"}
                    align={"center"}
                  >
                    <Empty description={false} />
                  </Flex>
                </>
              )}
            </div>
          </Content>
          <Footer style={{ textAlign: "center", backgroundColor: "#E1EEBC" }}>
            JAVAD ©{new Date().getFullYear()}
          </Footer>
        </Layout>
      </Layout>
    </>
  );
}

export default memo(Containers);
