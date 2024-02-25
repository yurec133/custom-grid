import { SchedulerViewItem } from "@progress/kendo-react-scheduler";

const CustomItem = (props) => {
  const {
    // eslint-disable-next-line react/prop-types
    dataItem: { title, length, style },
  } = props;
  return (
    <SchedulerViewItem
      {...props}
      style={{
        ...style,
        height: "auto",
      }}
    >
      {title} {length}
    </SchedulerViewItem>
  );
};

export default CustomItem;
