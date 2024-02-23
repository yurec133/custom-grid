import React from "react";
import "@progress/kendo-theme-default/dist/all.css";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { DragAndDrop, Droppable } from "@progress/kendo-react-common";
import {
  Scheduler,
  WeekView,
  MonthView,
  SchedulerItem,
} from "@progress/kendo-react-scheduler";
import { guid } from "@progress/kendo-react-common";
import { DragHandleCell } from "./DragHandleCell.jsx";
import { DraggableRow } from "./DraggableRow.jsx";
import gridData from "../data.js";

export const ReorderContext = React.createContext({
  dragStart: () => {},
});

const classSlotCell = "k-scheduler-cell k-slot-cell k-nonwork-hour";
const allClassSlotCell = "." + classSlotCell.replace(/ /g, ".");

const updateTargetBackground = (target, color) => {
  if (target.className === classSlotCell) {
    target.style.background = color;
  }
};
const handleDragOver = (e) => {
  const target = document.elementFromPoint(e.event.clientX, e.event.clientY);
  const allElements = document.querySelectorAll(allClassSlotCell);
  allElements.forEach((element) => {
    updateTargetBackground(element, "");
  });
  updateTargetBackground(target, "rgba(255, 124, 115, 0.5)");
};
const CustomItem = (props) => {
  const {
    // eslint-disable-next-line react/prop-types
    dataItem: { title, length },
  } = props;
  return (
    <SchedulerItem {...props}>
      {title} {length}
    </SchedulerItem>
  );
};

const CustomGrid = () => {
  const MyScheduler = React.useRef();
  const [activeItem, setActiveItem] = React.useState(null);
  const [data, setData] = React.useState([]);

  const handleDropItem = (e) => {
    if (!activeItem) {
      return;
    }
    const target = document.elementFromPoint(e.event.clientX, e.event.clientY);
    updateTargetBackground(target, "");
    const start = target.getAttribute("data-slot-start");
    const end = target.getAttribute("data-slot-end");
    const startDate = new Date(parseInt(start));
    const endDate = new Date(parseInt(end));
    const newEvent = {
      id: guid(),
      title: activeItem.title,
      length: activeItem.length,
      StartTimezone: null,
      start: startDate,
      end: endDate,
    };
    setData([newEvent, ...data]);
    setActiveItem(null);
  };

  const dragStart = (dataItem) => {
    setActiveItem(dataItem);
  };

  const handleDataChange = React.useCallback(
    ({ created, updated, deleted }) => {
      setData((old) =>
        old
          .filter(
            (item) =>
              deleted.find((current) => current.TaskID === item.TaskID) ===
              undefined
          )
          .map(
            (item) =>
              updated.find((current) => current.TaskID === item.TaskID) || item
          )
          .concat(
            created.map((item) =>
              Object.assign({}, item, {
                TaskID: guid(),
              })
            )
          )
      );
    },
    [setData]
  );

  return (
    <ReorderContext.Provider value={{ dragStart }}>
      <DragAndDrop>
        <Droppable
          onDrop={handleDropItem}
          onDragOver={handleDragOver}
          childRef={MyScheduler}
        >
          <Scheduler
            editable={true}
            onDataChange={handleDataChange}
            ref={MyScheduler}
            data={data}
            defaultDate={new Date("2013/6/13")}
            item={CustomItem}
            resources={[
              {
                name: "Status",
                data: [
                  {
                    text: "Planned",
                    value: 1,
                    color: "#5392E4",
                  },
                  {
                    text: "Scheduled",
                    value: 2,
                    color: "#54677B",
                  },
                ],
                field: "PersonIDs",
                valueField: "value",
                textField: "text",
                colorField: "color",
              },
            ]}
          >
            <WeekView showWorkHours={false} />
            <MonthView />
          </Scheduler>
        </Droppable>
        <hr />
        <Grid
          data={gridData}
          dataItemKey={"ProductID"}
          rowRender={(row, rowProps) => (
            <DraggableRow elementProps={row.props} {...rowProps} />
          )}
        >
          <Column field="taskID" title="ID" cell={DragHandleCell} />
          <Column field="title" title="Name" cell={DragHandleCell} />
          <Column field="length" title="Length" cell={DragHandleCell} />
        </Grid>
      </DragAndDrop>
    </ReorderContext.Provider>
  );
};

export default CustomGrid;
