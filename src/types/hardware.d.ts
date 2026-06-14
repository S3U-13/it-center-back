declare namespace Hardware {
  type queryIndexType = {
    page?: Number;
    limit?: Number;
    search?: String;
    dispense_status?: Number;
    location?: Number;
    FuncUnitID?: Number;
    start_date?: Date;
    end_date?: Date;
    pay_date?: Date;
    payer?: Number;
    hardware_type?: Number;
  };

  type Array_data = {
    rbj_no?: Number;
    sn?: Number;
    machine_name: String;
    note: String;
    payer: Number;
    pay_date: Date;
    dispense_status: Number;
  };

  type Body = {
    hardware_type: Number;
    array_data: any[];
  };
}
