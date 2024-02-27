import { SchedulerItem } from "@progress/kendo-react-scheduler";

const CustomItem = (props) => {
  const {
    // eslint-disable-next-line react/prop-types
    dataItem: { title, length, style },
  } = props;

  const itemStyle = {
    ...style,
    height: "auto",
  };

  return (
    <SchedulerItem {...props} style={itemStyle}>
      {title} {length}
    </SchedulerItem>
  );
};

export default CustomItem;
